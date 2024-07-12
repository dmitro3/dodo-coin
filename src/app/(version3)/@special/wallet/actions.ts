'use server';


import {useAccount, UseAccountReturnType} from "wagmi";
import {Config} from "@wagmi/core"

export async function setUserWallet(acc: ReturnType<typeof useAccount>) {
	acc
}
