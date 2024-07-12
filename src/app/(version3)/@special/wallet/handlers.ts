'use client';

import {useAccount} from "wagmi";
import {FetchedWalletToken} from "@v3/@special/wallet/hooks";

export async function doVerification(provider: ReturnType<typeof useProvider>,signer,account: ReturnType<typeof useAccount>, token: FetchedWalletToken) {
	console.log(account,token);
	account.connector
}
