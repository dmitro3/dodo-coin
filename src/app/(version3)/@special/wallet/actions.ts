'use server';



import {useAccount} from "wagmi";
import prisma from "@backend/modules/prisma/Prisma";
import {getUserFromCookies} from "@/utils/serverComponents/user";
import {getV3ConfigValue, V3Config} from "@v3/@special/config";
import {VerifyMethod} from "@prisma/client";

export async function setUserWallet(acc:Omit<ReturnType<typeof useAccount>, 'connector'>) {
	const address = acc.address;
	if (!address || typeof acc.chainId === 'undefined') {
		console.error("ADDRESS/CHAIN-ID NOT DEFINED");
		return;
	}

	const user = await getUserFromCookies();
	if (!user) throw("USER NOT FOUND");

	const data = {
		address,
		chainId: acc.chainId,
		userId: user.id,
		data: JSON.stringify(acc)
	};

	await prisma.userConnectedWallet.upsert({
		where: {
			unique: {
				address,
				chainId: acc.chainId
			}
		},
		create: data,
		update: data
	})
}

export async function getConfig<T extends keyof V3Config>(key: T){
	return getV3ConfigValue(key);
}

export async function handleVerificationResponse(method: VerifyMethod, address: string, result: any,amount: string) {
	return await prisma.walletVerification.create({
		data: {
			method,
			address,
			result,
			amount
		}
	})
}
