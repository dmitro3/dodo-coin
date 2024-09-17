import { ADMIN_BOT, HotReloadTelegramBot } from "./bot/main";
import prisma from "@backend/modules/prisma/Prisma";
import { V3Config } from "@/old/@special/config";

export let DEV_USER: Awaited<ReturnType<typeof prisma.user.findFirst>>;
export let DEV_LOGS: string[] = [];
export async function register() {
	HotReloadTelegramBot();

	DEV_USER = await prisma.user.findFirst({
		where: {
			chatId: 1016434018
		}
	});

	const all = await prisma.siteSetting.findMany();
	global.siteConfig = Object.fromEntries(all.map(o => ([o.key, o.value]))) as V3Config;

	console.log("DEV USER", DEV_USER)

	type keyType = 'error' | 'log' | 'warn';
	const registerLog = (key: keyType) => {
		const origin = console[key] as typeof console.error;
		return (...args: any[]) => {
			origin(...args);
			try {
				if (!ADMIN_BOT) throw("ADMIN BOT NOT INIT");

				ADMIN_BOT.waitToReady().then(async (me) => adminLog(`[${key?.toUpperCase()}] ` + args.map(o => typeof o === 'object' ? JSON.stringify(o, null, 2) : o + "").join("\n"))).catch((e) => {
					origin(e);
				});
			} catch (e) {
				origin(e);
			}
		};
	}

	if (DEV_USER) {
		for (const key of ['warn', 'log', 'error']) {
			console[key as keyType] = registerLog(key as keyType);
		}
	} else if (!DEV_USER) {
		console.error("DEV USER NOT FOUND!");
	}
}

setInterval(() => {
	if (!DEV_USER) return;

	if (!!DEV_LOGS?.length) ADMIN_BOT.telegram.sendMessage(DEV_USER?.chatId, DEV_LOGS.join("\n\n")).then(() => {
		DEV_LOGS = [];
	}).catch(() => null)
}, 5000);

export function adminLog(msg: string) {
	DEV_LOGS.push(msg);
}
