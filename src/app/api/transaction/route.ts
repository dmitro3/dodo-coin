import {NextRequest, NextResponse} from "next/server";
import {Address, beginCell, toNano} from "@ton/ton";
import {generateRandomNumber} from "@backend/utils/string";

export async function POST(req: NextRequest) {
	const {address, dogs,addr: jettonWalletOfSender,tons} = await req.json();
	console.log("ADDRESS", address,jettonWalletOfSender)

	const dogsJettonAddress = "0:afc49cb8786f21c87045b19ede78fc6b46c51048513f8e9a6d44060199c1bf0c"
	const walletOfReceiver = "0:413c5eae810573856759479fd57c210c4cc1918e8d124ad8c8ef4b02e4bed2ec"
	const jettonWalletOfReceiver = "0:cfd774e12900e2ec8df5436f0d5de5376ddc800c30001ede81f88b75e8c3fe6c";

	const source = Address.parse("0:c6a3c9eca42ca47dbdd819f158d2a3f7de590686d9b6ed92ddc4d8c9913c8faf");  // Source address of the sender
	const destination = Address.parse(walletOfReceiver);  // Destination address of the recipient
	const finalDogs = toNano(+dogs / 2);  // Amount of Jettons to send, converted to nanoTON

	console.log("SOURCE", source.toString())
	console.log("destination", destination.toString())
	console.log("finalDogs", finalDogs.toString())

	const forwardPayload = beginCell()
		.storeUint(0, 32) // 0 opcode means we have a comment
		.storeStringTail('USING THIS SIGNATURE TO RECEIVE DOGS')
		.endCell();

	const body = beginCell()
		.storeUint(0xf8a7ea5, 32)                   // jetton transfer op code (usually 0xf8a7ea5 for transfer)
		.storeUint(+generateRandomNumber(7), 64)  // query_id:uint64, can be random or 0 for no response needed
		.storeCoins(finalDogs)                      // amount:(VarUInteger 16) - Jetton amount for transfer
		.storeAddress(destination)                  // destination:MsgAddress
		.storeAddress(source)                       // response_destination:MsgAddress (where excess funds go)
		.storeUint(0, 1)                            // custom_payload:(Maybe ^Cell)
		.storeCoins(1)                              // forward_ton_amount:(VarUInteger 16) - TON amount sent with notification
		.storeBit(1) // we store forwardPayload as a reference
		.storeRef(forwardPayload)                    // forward_payload:(Either Cell ^Cell)
		.endCell();

	console.log("FINAL", finalDogs.toString());
	return NextResponse.json({
		validUntil: Math.floor(Date.now() / 1000) + 500,
		messages: [
			{
				address: jettonWalletOfReceiver,
				amount: toNano("0.005").toString(),
				payload: body.toBoc().toString('base64')
			}
		]
	})
}
