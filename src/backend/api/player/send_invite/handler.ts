import Handler from "@backend/modules/Handler";
import prisma from "@backend/modules/prisma/Prisma";
import {userDetails} from "@backend/api/login/handler";
import {getToken} from "@backend/utils/user";
import {CLIENT_BOT} from "@/bot/main";

export default class UpgradeHandler extends Handler {
	async handler() {
		const user = await this.getUser();
		if (!user) throw(401);
		await CLIENT_BOT.waitToReady();
		const link = `https://t.me/${CLIENT_BOT.me?.username}?start=${user.id}`
		const text = `${link}\n🎁 +2.5k Shares as a first-time gift`;
		await CLIENT_BOT.telegram.sendMessage(user.chatId,"" )
		return {}
	}
}
