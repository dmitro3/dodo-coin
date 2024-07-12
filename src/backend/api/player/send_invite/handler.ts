'use server';

import Handler from "@backend/modules/Handler";
import {CLIENT_BOT} from "@/bot/main";
import {Markup} from "telegraf";
import {User} from "@prisma/client";
import {communityButton, getWebAppUrl} from "@/bot/classes/DodoClient";
import {getUserFromCookies} from "@/utils/serverComponents/user";
import {sendInvite} from "@backend/api/player/send_invite/actions";

export default class UpgradeHandler extends Handler {
	async handler() {
		const user = await this.getUser();
		if (!user) throw(401);
		await sendInvite(user);
		return {}
	}
}
