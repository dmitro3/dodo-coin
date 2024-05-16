import Handler from "@backend/modules/Handler";
import prisma from "@backend/modules/prisma/Prisma";
import {userDetails} from "@backend/api/login/handler";

export default class UpgradeHandler extends Handler {
	async handler() {
		return {
			refs: [],
			has_more: false
		}
	}
}
