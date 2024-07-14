'use server'

import prisma from "@backend/modules/prisma/Prisma";
import {cookies} from "next/headers";
import {getUserFromCookies} from "@/utils/serverComponents/user";

export async function setCurrentUser(token: string) {
	const user = await prisma.user.findUnique({
		where: {
			token
		}
	});
	if (!user) return undefined;
	cookies().set("token", user.token(), {
		path: "/",
		expires: new Date().getTime() + 3600 * 60 * 60 * 1000
	})

	return user;
}


export async function startFarm() {
	const user = await getUserFromCookies();
	if (!user) return;
	if (user.isExpired) {
		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				farmStartAt: new Date()
			}
		})
	}
}

export async function claimFarm() {
	const user = await getUserFromCookies();
	if (!user || !user.isExpired) return;

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			farmStartAt: null,
			wallet: {
				increment: user.farmed
			}
		}
	})
}
