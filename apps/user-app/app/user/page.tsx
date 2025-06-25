"use client"
import { useStore } from "@repo/store/store"
import Temp from "@repo/ui/temp"
import { prisma } from "@repo/db/client";

function page() {
  const balance=useStore((state)=>state.balance);
  return (
    <div className="flex flex-col items-center h-screen justify-center bg-red-100">page
    {""+balance}
    <Temp/>
    </div>
  )
}

export default page