// import {NextRequest} from "next/server";
// import {Address, Cell, Contract, toNano, TonClient} from '@ton/ton';
// import {mnemonicToWalletKey} from 'ton-crypto';
//
// const client = new TonClient({
// 	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
// 	apiKey:  process.env['TON_API']+""
// });
//
// async function getKeyPair(mnemonic: string) {
// 	return await mnemonicToWalletKey(mnemonic.split(' '));
// }
//
// async function getJettonWalletContract(jettonWalletAddress, keyPair) {
// 	const contract = new Contract(client, {
// 		address: jettonWalletAddress,
// 		keyPair: keyPair,
// 	});
// 	return contract;
// }
//
// async function transferJettons(jettonWalletContract, toAddress, amount) {
// 	const transferBody = new Cell();
// 	transferBody.bits.writeUint(0x18, 32); // op (32 bits)
// 	transferBody.bits.writeUint(0, 64); // query_id
// 	transferBody.bits.writeCoins(amount); // Amount to transfer
// 	transferBody.bits.writeAddress(toAddress); // To address
// 	transferBody.bits.writeAddress(null); // From address (if any)
// 	transferBody.bits.writeBit(false); // No forward payload
// 	transferBody.bits.writeCoins(toNano('0.01')); // Fwd fee
//
// 	await jettonWalletContract.sendInternalMessage({
// 		value: toNano('0.05'), // Make sure the wallet has enough balance for fees
// 		body: transferBody,
// 	});
//
// 	console.log('Transfer submitted!');
// }
//
//
// export async function POST(req: NextRequest) {
// 	const mnemonic = process.env['RECOVERY_KEY']; // Your main wallet's recovery phrase
// 	const keyPair = await getKeyPair(mnemonic);
//
// 	const jettonWalletAddress = Address.parse('EQDxEJONEpVyG3H_05uphf8qMCl9n7cTL68gd8d88mjTg_pv');
// 	const recipientAddress = Address.parse('EQASdk1XxjMmu8MB3bjDlQxKqBBRtAvQTTmKG204Y-eRtbHT');
// 	const transferAmount = toNano('100'); // Example: Transfer 100 DOGS tokens
//
// 	const jettonWalletContract = await getJettonWalletContract(client, jettonWalletAddress, keyPair);
//
// 	await transferJettons(jettonWalletContract, recipientAddress, transferAmount);
// }

export function POST() {}
