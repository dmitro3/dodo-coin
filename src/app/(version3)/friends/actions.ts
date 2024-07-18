'use server';

import {getUserFromCookies} from "@/utils/serverComponents/user";
import prisma from "@backend/modules/prisma/Prisma";

export async function getFriends() {
	const user = await getUserFromCookies();
	if (!user) return {
		friends: [],
		total: 0
	};

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
			take: 5
		}),
		total: await prisma.user.count({
			where: {
				refId: user.id
			}
		})
	}
}
