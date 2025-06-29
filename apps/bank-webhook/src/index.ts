import { prisma } from "@repo/db/client";
import express from "express"

const app=express();
app.use(express.json());

app.post("/hdfcWebhook", async (req,res)=>{
   const paymentInformation={
        token:req.body.token,
        userId:req.body.user_identifier,
        amount:req.body.amount
        }
    try{
         
        await prisma.$transaction(async (tx)=>{
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(paymentInformation.userId)} FOR UPDATE`
            const trxn= await tx.onRampTransaction.findUnique({
                where:{
                    token:paymentInformation.token
                }
            });
            if(!trxn){
                
                throw new Error("Transaction not found");
            }
            if(trxn.amount!=paymentInformation.amount || trxn.status!='Processing'){
                
                
                throw new Error("Transaction detail mismatch");
            }

            await tx.balance.update({
                where:{
                    userId:paymentInformation.userId
                },
                data:{
                    amount:{increment:paymentInformation.amount}
                }
            });
            await tx.onRampTransaction.update({
                where:{
                    token:paymentInformation.token
                },
                data:{
                    status:"Success"
                }
            })
        })

        res.json({
            message:"captured"
        })
        
    }catch(e){
        res.status(411).json({
            message:"Error while processing webhook",
            error: e instanceof Error ? e.message : e,
        })
    }


})

app.listen(4500);