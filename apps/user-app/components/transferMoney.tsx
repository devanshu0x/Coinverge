"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textInput";
import { useState } from "react";
import { transferMoney } from "../lib/actions/transferMoney";


export function TransferMoney() {
  const [number,setNumber]=useState("");
  const [amount,setAmount]=useState("");
  return (
    <Card title="P2P Transfer">
        <div className="w-80 py-4">
            <TextInput label="Number" placeholder="99999999999" onChange={(value)=>{setNumber(value)}} />
            <TextInput label="Amount" placeholder="1000" onChange={(value)=>{setAmount(value)}}/>
        </div>
        <div className="text-center">
            <Button onClick={()=>{
              transferMoney(Number(amount)*100,number);
            }}>
            Send
        </Button>
        </div>
    </Card>
  )
}

