import GoogleProvider from "next-auth/providers/google"

export const authOptions={
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    secret:process.env.JWT_SECRET || "secret",
    callbacks:{
        async session({session,user,token}:any){
            session.user.id=token.id;
            return session;
        }
    }
}