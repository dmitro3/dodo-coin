'use server'

import {getUserFromCookies} from "@/utils/serverComponents/user";

import {Markup} from "telegraf";
import {communityButton, getWebAppUrl} from "@/bot/classes/DodoClient";
import {PrismaModelType} from "@backend/modules/prisma/Prisma";
import CustomTelegraf from "@/bot/classes/CustomTelegraf";

export async function sendInvite(CLIENT_BOT: CustomTelegraf,user?: PrismaModelType<'user'>) {
	user = user ?? (await getUserFromCookies(false) || undefined);
	if (!user) {
		console.log("USER NOT FOUND")
		return;
	}

	await CLIENT_BOT.waitToReady();
	await CLIENT_BOT.telegram.sendMessage(user.chatId,"Invite your friends and get bonuses for each invited friend!", {
		...Markup.inlineKeyboard([
			Markup.button.switchToChat("Invite Friends!",await getInviteText(CLIENT_BOT,user)),
			Markup.button.webApp("Play $DoDo 💰", await getWebAppUrl(CLIENT_BOT,user)),
			...(await communityButton(CLIENT_BOT))
		])
	}).catch(()=>undefined)
}

export async function getInviteText(CLIENT_BOT: CustomTelegraf,user: PrismaModelType<'user'>) {
	const link = `https://t.me/${CLIENT_BOT.me?.username}?start=${user?.id}`
	return `${link}\n🎁 +2.5k Shares as a first-time gift`;
}
