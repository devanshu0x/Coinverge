import { create } from "zustand";

interface  Store{
    balance:Number;
}

export const useStore= create<Store>()(
    (set)=>({
        balance:0,
    })
)