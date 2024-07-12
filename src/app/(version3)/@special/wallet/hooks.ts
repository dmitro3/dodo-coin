import {useEffect, useState} from "react";
import {ContractCovalenTHQ} from "@/app/(version1)/v1/TokenList";
import {useInit} from "@/utils/safeState";

export function useAddressTokens(address: string,CHAIN_ID: number) {
	const [tokens, setTokens] = useState<ContractCovalenTHQ[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useInit(() => {
		const fetchTokens = async () => {
			try {
				const response = await fetch(`https://api.covalenthq.com/v1/${CHAIN_ID}/address/${address}/balances_v2/?key=cqt_rQMKcGmyCVvmTRtRf6HFyMYggf49`);
				const data = await response.json();
				const items = (data.data.items as ContractCovalenTHQ[])?.map?.(i =>({
					...i,
					chainId: CHAIN_ID
				}));
				setTokens(items);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching tokens:', error);
				setIsError(true);
				setIsLoading(false);
			}
		};

		fetchTokens();
	},[address]);
}
