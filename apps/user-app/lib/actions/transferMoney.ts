"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth";
import { prisma } from "@repo/db/client";


export async function transferMoney(amount:number,recipentNumber:string){
    const session=await getServerSession(authOptions);
    const from= session?.user?.id;
    const recipent= await prisma.user.findUnique({
        where:{
            number:recipentNumber
        }
    })
    if(!recipent){
        return {
            message:"recipent not found"
        }
    }
    const toId=recipent.id;

    try{
        await prisma.$transaction(async (tx)=>{
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(from)} FOR UPDATE`;

        const fromBalance= await tx.balance.findUnique({
            where:{
                userId:Number(from)
            }
        })
        if(!fromBalance || fromBalance.amount<amount){
            throw new Error("Insufficent funds!");
        }


        await tx.balance.update({
            where:{
                userId:Number(from)
            },
            data:{
                amount:{decrement:amount}
            }
        })

        await tx.balance.update({
            where:{
                userId:recipent.id
            },
            data:{
                amount:{increment:amount}
            }
        })

        await tx.p2PTransfer.create({
            data:{
                amount:amount,
                timestamp:new Date(),
                fromUserId:Number(from),
                toUserId:Number(toId),
            }
        })
    })
    return {
        message:"Successful transfer!"
    }
    }catch(e){
        return {
            message:"Failed",
            error: e instanceof Error ? e.message : e,
        }
    }
}