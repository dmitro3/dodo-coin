import {ADMIN_BOT, HotReloadTelegramBot} from "./bot/main";
import prisma from "@backend/modules/prisma/Prisma";
import {User} from "@prisma/client";

export let DEV_USER: User;
export const DEV_LOGS: string[] = [];
export async function register() {
	HotReloadTelegramBot();

	const admin = await prisma.user.findFirst({
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
				adminLog(args.map(o => o+"").join("\n"));
			}).catch(origin);
			return R;
		};
	}

	for (const key of ['warn','log', 'error']) {
		console[key as keyType] = registerLog(key as keyType);
	}
}

export function adminLog(msg: string) {
	DEV_LOGS.push(msg);
}
