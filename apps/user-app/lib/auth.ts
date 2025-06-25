import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "@repo/db/client";


export const authOptions={
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                phone:{label:"Phone number", type:"text",placeholder:"123456789"},
                password:{label:"Password",type:"password",placeholder:"**********"}
            },

            async authorize(credentials){
                if(!credentials){
                    return null;
                }
                const hashedPassword= await bcrypt.hash(credentials.password,10);
                const existingUser= await prisma.user.findFirst({
                    where:{
                        number:credentials.phone
                    }
                });

                if(existingUser){
                    const passwordValidation=await bcrypt.compare(credentials.password,existingUser.password);
                    if(passwordValidation){
                        return(
                            {
                                id:existingUser.id.toString(),
                                name:existingUser.name,
                                email:existingUser.number
                            }
                        )
                    }
                    else{
                        return null;
                    }
                }

                try{
                    const user=await prisma.user.create({
                        data:{
                            number:credentials.phone,
                            password:hashedPassword
                        }
                    });

                    return({
                        id:user.id.toString(),
                        name:user.name,
                        number:user.number
                    })
                }catch(e){
                    console.error(e);
                }
                return null;
            }
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