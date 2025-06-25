import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@repo/db/client";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        number: { label: "Phone number", type: "text", placeholder: "123456789" }, // changed to number
        password: { label: "Password", type: "password", placeholder: "**********" }
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        const existingUser = await prisma.user.findFirst({
          where: {
            number: credentials.number
          }
        });

        if (existingUser) {
          const isValid = await bcrypt.compare(credentials.password, existingUser.password);
          if (isValid) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              number: existingUser.number // consistent
            };
          } else {
            return null;
          }
        }

        try {
          const user = await prisma.user.create({
            data: {
              number: credentials.number,
              password: hashedPassword
            }
          });

          return {
            id: user.id.toString(),
            name: user.name,
            number: user.number // consistent
          };
        } catch (e) {
          console.error(e);
          return null;
        }
      }
    })
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.number = user.number; // consistent
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.number = token.number; // consistent
      return session;
    }
  }
};
