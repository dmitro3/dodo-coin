'use server';



import {useAccount} from "wagmi";

export async function setUserWallet(acc:Omit<ReturnType<typeof useAccount>, 'connector'>) {

}
