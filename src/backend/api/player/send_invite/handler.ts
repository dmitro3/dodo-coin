import Handler from "@backend/modules/Handler";
import prisma from "@backend/modules/prisma/Prisma";
import {userDetails} from "@backend/api/login/handler";
import {getToken} from "@backend/utils/user";
import {CLIENT_BOT} from "@/bot/main";

export default class UpgradeHandler extends Handler {
	async handler() {
		const user = await this.getUser();
		if (!user) throw(401);


		CLIENT_BOT.telegram.sendMessage(user.chatId, "")
		return {}
	}
}
