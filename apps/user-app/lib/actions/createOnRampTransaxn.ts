"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { prisma } from "@repo/db/client";


export async function createOnRampTransaction(amount:number,provider:string){
    const session= await getServerSession(authOptions);
    const userId= session?.user?.id;
    const date=new Date();
    const token= date.toString();
    if(!userId){
        return({
            message:"Not logged in"
        })
    }
    console.log(userId);
    const data=await prisma.onRampTransaction.create({
        data:{
            userId: Number(userId),
            amount:amount,
            status:"Processing",
            startTime: new Date(),
            provider,
            token:token
        }
    })
    if(data){
        return{
            message:"Success",
        }
    }
    else{
        return{
            message:"Unable to add trx to db"
        }
    }

}