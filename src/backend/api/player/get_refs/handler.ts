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
		if (!user) throw(401);

		return {
			refs: user.refs.map(u => ({
				"id": u.id,
				"name": u.username,
				"full_name": u.username,
				"earned": Math.round(u.wallet * 0.1),
				"rewards": 2
			})),
			has_more: false
		}
	}
}
