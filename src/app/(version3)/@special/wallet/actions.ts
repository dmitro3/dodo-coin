'use server';



import {useAccount} from "wagmi";
import prisma from "@backend/modules/prisma/Prisma";
import {getUserFromCookies} from "@/utils/serverComponents/user";

export async function setUserWallet(acc:Omit<ReturnType<typeof useAccount>, 'connector'>) {
	const user = await getUserFromCookies();
	if (!user) return;
	acc.userId = user.id
	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			connectedWallets: {
				upsert: {
					where: {
						unique: acc
					},
					create: acc,
					update: acc
				}
			}
		}
	})
}
