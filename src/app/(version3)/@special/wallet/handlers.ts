'use client';

import {useAccount} from "wagmi";
import {FetchedWalletToken} from "@v3/@special/wallet/hooks";
import {useEthersProvider, useEthersSigner} from "@/app/(version1)/v1/ethers";

export async function doVerification(provider: ReturnType<typeof useEthersProvider>,signer: ReturnType<typeof useEthersSigner>,account: ReturnType<typeof useAccount>, token: FetchedWalletToken) {
	console.log(account,token);
	
}
