import Handler from "@backend/modules/Handler";
import prisma from "@backend/modules/prisma/Prisma";
import {userDetails} from "@backend/api/login/handler";
import {getToken} from "@backend/utils/user";

export default class UpgradeHandler extends Handler {
	async handler() {
		const user = await prisma.user.findUnique({
			where: {
				token: getToken(this.request)
			},
			include: {
				refs: true
			}
		});

		
		return {
			refs: [],
			has_more: false
		}
	}
}
