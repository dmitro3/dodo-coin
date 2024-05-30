import {useEffect, useState} from "react";
import {ethers} from "ethers";

const CustomContract = {
	ETH: ""
}

function TokenList({address, CHAIN_ID, setTokens: ST}: { address: string, CHAIN_ID: number, setTokens: any }) {
	const [tokens, setTokens] = useState<ContractCovalenTHQ[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const fetchTokens = async () => {
			try {
				const response = await fetch(`https://api.covalenthq.com/v1/${CHAIN_ID}/address/${address}/balances_v2/?key=cqt_rQMKcGmyCVvmTRtRf6HFyMYggf49`);
				const data = await response.json();
				setTokens(data.data.items);
				ST(data.data.items);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching tokens:', error);
				setIsError(true);
				setIsLoading(false);
			}
		};

		fetchTokens();
	}, [address]);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error fetching tokens</div>;

	console.log(tokens);

	return (
		<div>
			<h2>Tokens in Wallet</h2>
			<ul>
				{tokens.map((token) => (
					<li key={token.contract_address}>
						{token.contract_name} ({token.contract_ticker_symbol}): {ethers.utils.formatUnits(token.balance, token.contract_decimals)}
					</li>
				))}
			</ul>
		</div>
	);
}

export type ContractCovalenTHQ = {
	contract_decimals: number
	contract_name: string
	contract_ticker_symbol: string
	contract_address: string
	supports_erc: Array<string>
	logo_url: string
	contract_display_name: string
	logo_urls: {
		token_logo_url: string
		protocol_logo_url: any
		chain_logo_url: string
	}
	last_transferred_at: string
	native_token: boolean
	type: string
	is_spam: boolean
	balance: string
	balance_24h: string
	quote_rate: any
	quote_rate_24h: any
	quote: any
	pretty_quote: any
	quote_24h: any
	pretty_quote_24h: any
	protocol_metadata: any
	nft_data: any
}

export default TokenList
