'use server';

import {getUserFromCookies} from "@/utils/serverComponents/user";
import prisma from "@backend/modules/prisma/Prisma";

export async function getFriends() {
	const user = await getUserFromCookies();

	return await prisma.user.findMany({
		where: {
			refId: user?.id
		},
		include: {
			_count: {
				select: {
					refs: true
				}
			}
		}
	})
}
