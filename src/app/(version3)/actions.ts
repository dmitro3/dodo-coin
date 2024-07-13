'use server'

import prisma from "@backend/modules/prisma/Prisma";
import {cookies} from "next/headers";

export async function setCurrentUser(token: string) {
	const user = await prisma.user.findUnique({
		where: {
			token
		}
	});
	if (!user) return false;
	cookies().set("token", token, {
		path: "/",
		expires: new Date().getTime() + 3600 * 60 * 60 * 1000
	})

	return true
}
