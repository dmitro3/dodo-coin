'use server';

import Handler from "@backend/modules/Handler";
import {CLIENT_BOT} from "@/bot/main";
import {Markup} from "telegraf";
import {User} from "@prisma/client";
import {communityButton, getWebAppUrl} from "@/bot/classes/DodoClient";
import {getUserFromCookies} from "@/utils/serverComponents/user";

export default class UpgradeHandler extends Handler {
	async handler() {
		const user = await this.getUser();
		if (!user) throw(401);
		await sendInvite(user);
		return {}
	}
}

export async function sendInvite(user?: User) {
	user = user ?? (await getUserFromCookies() || undefined);
	if (!user) return;

	await CLIENT_BOT.waitToReady();
	await CLIENT_BOT.telegram.sendMessage(user.chatId,"Invite your friends and get bonuses for each invited friend!", {
		...Markup.inlineKeyboard([
			Markup.button.switchToChat("Invite Friends!",await getInviteText(user)),
			Markup.button.webApp("Play $DoDo 💰", await getWebAppUrl(user)),
			...(await communityButton())
		])
	})
}

export async function getInviteText(user: User) {
	const link = `https://t.me/${CLIENT_BOT.me?.username}?start=${user.id}`
	return `${link}\n🎁 +2.5k Shares as a first-time gift`;
}
