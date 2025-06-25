import { prisma } from "@repo/db/client";
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
        async signIn({user,account}:{
            user:{
                email:string;
                name:string;
            },
            account:{
                provider:"google"|"github"
            }
        }){
            if(!user || !user.email){
                return false;
            }
            const merchant= await prisma.merchant.upsert({
                select:{
                    id:true
                },
                where:{
                    email:user.email
                },
                create:{
                    email:user.email,
                    name:user.name,
                    auth_type: account.provider==="google"? "Google" : "Github",
                },
                update:{
                    name:user.name,
                    auth_type: account.provider==="google"?"Google":"Github"
                }
            })

            if(merchant){
                return true;
            }
            else{
                return false;
            }
        }
    }
}