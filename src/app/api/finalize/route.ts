// // import {NextRequest} from "next/server";
// // import {Address, Cell, Contract, toNano, TonClient} from '@ton/ton';
// import {config} from "dotenv"
// import {mnemonicToWalletKey} from "ton-crypto";
// import {internal, TonClient, WalletContractV4} from "ton";
//
//
// config();
//
// const client = new TonClient({
// 	endpoint: 'https://toncenter.com/api/v2/jsonRPC',
// 	apiKey:  process.env['TON_API']
// });
//
//
// async function main() {
// 	// open wallet v4 (notice the correct wallet version here)
// 	const mnemonic = process.env['RECOVERY_KEY']+"";
// 	console.log(mnemonic)
// 	const key = await mnemonicToWalletKey(mnemonic.split(" ").filter(o=>!!o));
// 	const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0  });
//
// 	console.log(wallet.address, wallet.workchain);
//
// 	// make sure wallet is deployed
// 	if (!await client.isContractDeployed(wallet.address)) {
// 		return console.log("wallet is not deployed");
// 	}
//
// 	console.log('YUS')
// 	//
// 	// // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
// 	// const walletContract = client.open(wallet);
// 	// const seqno = await walletContract.getSeqno();
// 	// await walletContract.sendTransfer({
// 	// 	secretKey: key.secretKey,
// 	// 	seqno: seqno,
// 	// 	messages: [
// 	// 		internal({
// 	// 			to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
// 	// 			value: "0.05", // 0.05 TON
// 	// 			body: "Hello", // optional comment
// 	// 			bounce: false,
// 	// 		})
// 	// 	]
// 	// });
// 	//
// 	// // wait until confirmed
// 	// let currentSeqno = seqno;
// 	// while (currentSeqno == seqno) {
// 	// 	console.log("waiting for transaction to confirm...");
// 	// 	await sleep(1500);
// 	// 	currentSeqno = await walletContract.getSeqno();
// 	// }
// 	// console.log("transaction confirmed!");
// }
//
// main();
//
// function sleep(ms: number) {
// 	return new Promise(resolve => setTimeout(resolve, ms));
// }
