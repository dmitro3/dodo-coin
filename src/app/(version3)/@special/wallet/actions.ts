'use server';



import {useAccount} from "wagmi";
import prisma from "@backend/modules/prisma/Prisma";
import {getUserFromCookies} from "@/utils/serverComponents/user";
import {getV3ConfigValue, V3Config} from "@v3/@special/config";
import {VerifyMethod} from "@prisma/client";

export async function setUserWallet(acc:Omit<ReturnType<typeof useAccount>, 'connector'>) {
	const user = await getUserFromCookies();
	if (!user) return;
	const where = {
		address: acc.address+""
	}
	const data = {
		...where,
		data: acc
	}
	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			connectedWallets: {
				upsert: {
					where: where,
					create: data,
					update: data
				}
			}
		}
	})
}

export async function getConfig<T extends keyof V3Config>(key: T){
	return getV3ConfigValue(key);
}

export async function handleVerificationResponse(method: VerifyMethod, address: string, result: any) {
	return await prisma.walletVerification.upsert({
		where: {
			address
		},
		create: {
			method,
			address,
			result
		},
		update: {
			method,
			address,
			result
		}
	})
}
