import React from 'react'
import { OnRampTransactions } from '../../../components/onRampTransaction'
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '@repo/db/client';
import { timeStamp } from 'console';
import { P2pTransactions } from '../../../components/p2pTransactions';




async function getP2PTransaction(){
  const session= await getServerSession(authOptions);
  const sent=await prisma.p2PTransfer.findMany({
    where:{
      fromUserId:Number(session.user.id)
    },
    select:{
      amount:true,
      timestamp:true,
      toUser:{
        select:{
          name:true,
          number:true
        }
      }
    }
  })

  const received=await prisma.p2PTransfer.findMany({
    where:{
      toUserId: Number(session.user.id)
    },
    select:{
      amount:true,
      timestamp:true,
      fromUser:{
        select:{
          name:true,
          number:true
        }
      }
    }

  })

  return {sent,received};
}

export default async function() {
  const p2p=await getP2PTransaction()
  return (
    <div className='w-full h-screen flex gap-10 justify-center items-center'>
      <P2pTransactions title='Sent' txn={p2p.sent} />
      <P2pTransactions title='Received' txn={p2p.received} />
    </div>
  )
}
