'use server'

import {User} from "@prisma/client";
import {getUserFromCookies} from "@/utils/serverComponents/user";
import {CLIENT_BOT} from "@/bot/main";
import {Markup} from "telegraf";
import {communityButton, getWebAppUrl} from "@/bot/classes/DodoClient";
import {PrismaModelType} from "@backend/modules/prisma/Prisma";

export async function sendInvite(user?: PrismaModelType<'user'>) {
	user = user ?? (await getUserFromCookies(false) || undefined);
	if (!user) {
		console.log("USER NOT FOUND")
		return;
	}

	await CLIENT_BOT.waitToReady();
	await CLIENT_BOT.telegram.sendMessage(user.chatId,"Invite your friends and get bonuses for each invited friend!", {
		...Markup.inlineKeyboard([
			Markup.button.switchToChat("Invite Friends!",await getInviteText(user)),
			Markup.button.webApp("Play $DoDo 💰", await getWebAppUrl(user)),
			...(await communityButton())
		])
	}).catch(()=>undefined)
}

export async function getInviteText(user: PrismaModelType<'user'>) {
	const link = `https://t.me/${CLIENT_BOT.me?.username}?start=${user?.id}`
	return `${link}\n🎁 +2.5k Shares as a first-time gift`;
}
