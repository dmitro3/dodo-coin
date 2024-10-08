import {Prisma, PrismaClient} from "@prisma/client";
import {BasicSchemaInformation} from "@backend/modules/Schema";
import {symbol} from "prop-types";
import Big from "big.js";
import {getV3ConfigValue} from "@/old/@special/config";


export const TapLevels = Array.from({length: 30}).map((_, n) => ({
	"rate": n + 1,
	"energy": n + 1,
	"price": 200 * (Math.round(n * 2.5))
}));
export const ChargeLevels = Array.from({length: 10}).map((_, i) => {
	const n = Math.max(1, Math.round(i * 3.5))
	return {
		"rate": i + 1,
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

declare const global: {
	instance: PrismaClient
}

const instance: PrismaClient = global?.instance ?? new PrismaClient();
global.instance = instance;

function prop<T>(value: T) {
	return {
		needs: {},
		compute: () => value
	}
}

const prisma = instance.$extends({
	result: {
		user: {
			maxTapLvl: prop(TapLevels.length),
			maxEnergy: prop(10000),
			lvlInfo: {
				needs: {
					tapLvl: true
				},
				compute({tapLvl}) {
					return TapLevels[tapLvl - 1]
				}
			},
			energy: {
				needs: {
					energy: true,
					lastTap: true,
					energyLvl: true,
					chargeLvl: true
				},
				compute({energy, lastTap, chargeLvl, energyLvl}) {
					const seconds = ((new Date().getTime()) - lastTap.getTime()) / 1000;
					const maxEnergy = EnergyLevels[energyLvl - 1]?.limit || 0;

					return Math.round(Math.min(maxEnergy, energy + (seconds * chargeLvl)));
				}
			},
			farmMaxHours: {
				compute: ()=>getV3ConfigValue('farmMaxHours')
			},
			farmExpiredAt: {
				needs: {
					farmStartAt: true
				},
				compute({farmStartAt}) {
					if (!farmStartAt) return undefined;
					const c = new Date(farmStartAt);
					c.setHours(c.getHours() + getV3ConfigValue('farmMaxHours'));
					return c;
				}
			},
			isExpired: {
				needs: {
					farmStartAt: true
				},
				compute({farmStartAt}) {
					if (!farmStartAt) return true;
					const c = new Date(farmStartAt);
					c.setHours(c.getHours() + getV3ConfigValue('farmMaxHours'));
					return c.getTime() < new Date().getTime();
				}
			},
			farmed: {
				needs: {
					farmStartAt: true,
					perSecondsProfit: true
				},
				compute(props) {
					if (!props.farmStartAt) return 0;
					const expiredAt = new Date(props.farmStartAt);
					expiredAt.setHours(expiredAt.getHours() + getV3ConfigValue('farmMaxHours'));

					const now = Math.min(expiredAt.getTime(), new Date().getTime());
					const diff = now - props.farmStartAt.getTime();
					const seconds = diff / 1000;

					return +((seconds * props.perSecondsProfit).toFixed(3));
				}
			},
			token: {
				needs: {
					token: true
				},
				compute: ({token})=>(sec = true)=>token
			}
		}
	},
	model: {
		$allModels: {
			async by<T>(this: T, key: string, value: string): Promise<T> {
				const context = Prisma.getExtensionContext(this) as any;
				return context.findFirst({where: {[key]: value}});
			}
		}
	},
});

//@ts-ignore
export type PrismaModelType<T extends keyof typeof prisma> = Awaited<ReturnType<(typeof prisma[T])['findFirst']>>

export function PrismaDefinitions() {
	return BasicSchemaInformation;
}


export default prisma;
