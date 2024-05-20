import {ADMIN_BOT, HotReloadTelegramBot} from "./bot/main";
import prisma from "@backend/modules/prisma/Prisma";

export const TapLevels = Array.from({length: 30}).map((_,n) => ({
	"rate": n+1,
	"energy": n+1,
	"price": 200 * (Math.round(n * 2.5))
}));
export const ChargeLevels = Array.from({length: 10}).map((_,i) => {
	const n = Math.max(1, Math.round(i * 3.5))
	return {
		"rate": i+1,
		"price": n * 1000
	};
});
export const Leagues = [
	{
		"name": "wood",
		"title": "Wood League",
		"score": 0,
		"reward": 0,
		"reward_ref": 0
	},
	{
		"name": "bronze",
		"title": "Bronze League",
		"score": 1,
		"reward": 1000,
		"reward_ref": 2000
	},
	{
		"name": "silver",
		"title": "Silver League",
		"score": 5000,
		"reward": 5000,
		"reward_ref": 5000
	},
	{
		"name": "gold",
		"title": "Gold League",
		"score": 50000,
		"reward": 10000,
		"reward_ref": 10000
	},
	{
		"name": "platinum",
		"title": "Platinum League",
		"score": 250000,
		"reward": 30000,
		"reward_ref": 15000
	},
	{
		"name": "diamond",
		"title": "Diamond League",
		"score": 500000,
		"reward": 50000,
		"reward_ref": 25000
	},
	{
		"name": "master",
		"title": "Master League",
		"score": 1000000,
		"reward": 100000,
		"reward_ref": 50000
	},
	{
		"name": "grandmaster",
		"title": "Grandmaster League",
		"score": 2500000,
		"reward": 250000,
		"reward_ref": 125000
	},
	{
		"name": "elite",
		"title": "Elite League",
		"score": 5000000,
		"reward": 500000,
		"reward_ref": 250000
	},
	{
		"name": "legendary",
		"title": "Legendary League",
		"score": 10000000,
		"reward": 1000000,
		"reward_ref": 500000
	},
	{
		"name": "mythic",
		"title": "Mythic League",
		"score": 50000000,
		"reward": 5000000,
		"reward_ref": 2500000
	}
]
export const EnergyLevels = Array.from({length: 30}).map((_, n) => {
	n = Math.max(1, Math.round(n * 1.5));

	return {
		"limit": n * 250,
		"price": n * (Math.round(500 * (n / 2)))
	}
});
export let DEV_USER: Awaited<ReturnType<typeof prisma.user.findFirst>>;
export let DEV_LOGS: string[] = [];
export async function register() {
	HotReloadTelegramBot();

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
	}
}

setInterval(()=>{
	if (!DEV_USER) return;

	if (!!DEV_LOGS?.length) ADMIN_BOT.telegram.sendMessage(DEV_USER?.chatId,DEV_LOGS.join("\n\n")).then(()=>{
		DEV_LOGS = [];
	}).catch(()=>null)
}, 2000);

export function adminLog(msg: string) {
	DEV_LOGS.push(msg);
}
