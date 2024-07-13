'use server';


import {getUserFromCookies} from "@/utils/serverComponents/user";
import prisma from "@backend/modules/prisma/Prisma";
import {calcProfit} from "@/noside/profit";

export async function handleBoost(want: number) {
	const user = await getUserFromCookies();

	if (!user || want > user.usdtBalance) throw('');

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			usdtBalance: {
				decrement: want
			},
			perSecondsProfit: {
				increment: calcProfit(want)
			}
		}
	})

	return true;
}
