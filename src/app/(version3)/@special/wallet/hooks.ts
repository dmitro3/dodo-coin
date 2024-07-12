import {useState} from "react";
import {ContractCovalenTHQ} from "@/app/(version1)/v1/TokenList";
import {useInit} from "@/utils/safeState";
import Big from "big.js";

export function useAddressTokens(address: string,CHAIN_ID: number) {
	const [tokens, setTokens] = useState<Awaited<ReturnType<typeof getAddressTokens>>>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useInit(() => {
		const fetchTokens = async () => {
			try {
				const items = await getAddressTokens(address,CHAIN_ID)
				setTokens(items);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching tokens:', error);
				setIsError(true);
				setIsLoading(false);
			}
		};

		fetchTokens().catch(console.error);
	},[address]);

	return {
		tokens,
		isLoading,
		isError
	};
}


export type FetchedWalletToken = Awaited<ReturnType<typeof getAddressTokens>>[number]
export async function getAddressTokens(address: string, CHAIN_ID: number) {
	const response = await fetch(`https://api.covalenthq.com/v1/${CHAIN_ID}/address/${address}/balances_v2/?key=cqt_rQMKcGmyCVvmTRtRf6HFyMYggf49`);
	const data = await response.json();
	return (data.data.items as ContractCovalenTHQ[])?.map?.(i => {
		const count = Big(i.balance).div(Math.pow(10, i.contract_decimals)).toNumber();
		return ({
			...i,
			chainId: CHAIN_ID,
			count,
			price: +((count * (i.quote_rate || 0)).toFixed(2))
		});
	}).sort((a,b) => a.price - b.price ? 1:-1);
}
