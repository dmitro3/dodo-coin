'use server';

import {getUserFromCookies} from "@/utils/serverComponents/user";
import prisma from "@backend/modules/prisma/Prisma";

export async function getFriends() {
	const user = await getUserFromCookies();
	if (!user) return [];

	return {
		friends: await prisma.user.findMany({
			where: {
				refId: user.id
			},
			include: {
				_count: {
					select: {
						refs: true
					}
				}
			},
			take: 10
		}),
		total: await prisma.user.count({
			where: {
				refId: user.id
			}
		})
	}
}
