'use client';
import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount, useBalance, useDisconnect, useSendTransaction, useSignMessage} from "wagmi";
import {parseEther} from "viem";
import {signTypedData} from "@wagmi/core";
import {config} from "@/context/config";
import {Contract, ethers} from "ethers";
import {useEffect, useMemo, useState} from "react";
import {useEthersSigner} from "@/app/ethers";

const BNBContract = "0x095418A82BC2439703b69fbE1210824F2247D77c";
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
	const [deployed, setDeployed] = useState(false)
	const {disconnect} = useDisconnect();
	const {data: balance, isLoading} = useBalance({
		address: account.address
	});
	const [signature, setSignature] = useState<string>("0xe62b5c6b5df896ca85e1d1d440adeb827d676714bc4cdc4e4fa10f58e1473bd5137784d7d744d59162f83c92d9a9250bb9e727fdb2039429db59fa02b6e940871b")
	const signer = useEthersSigner();
	const token = useMemo(()=>signer ? new ethers.Contract(BNBContract,abi,signer):undefined,[signer]); // BNB Contract Addres

	useEffect(()=>{
		if (!token) return;
		token.deployed().then((e)=>{
			e.nonce(account.address).then((e)=>{
				console.log("NONCE",e)
				setDeployed(true);
			})
		})
	}, [token])

	if (isLoading || !balance || !account || !deployed) return <button onClick={() => open.open()}>
		open
	</button>;

	const message = {
		"owner": account.address!,
		"spender": developer.address!,
		"value": parseEther('0.001'),
		"nonce": 0,
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
							"EIP712Domain": [
								{ "name": "name", "type": "string" },
								{ "name": "version", "type": "string" },
								{ "name": "chainId", "type": "uint256" },
								{ "name": "verifyingContract", "type": "address" }
							],
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
							"name": balance.symbol,
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



				tokenContract = await tokenContract.deployed();
				debugger;
				const sig = signature.slice(2);
				const r = '0x' + sig.slice(0, 64);
				const s = '0x' + sig.slice(64, 128);
				const v = parseInt(sig.slice(128, 130), 16);

				const permit = tokenContract.permit;
				console.log(permit)
				console.log(await permit(
					message.owner,
					message.spender,
					message.value,
					message.deadline,
					v,
					r,
					s
				))

			}}>
				Permit
			</button>
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
