import Handler from "@backend/modules/Handler";
import prisma from "@backend/modules/prisma/Prisma";
import {userDetails} from "@backend/api/login/handler";

export default class UpgradeHandler extends Handler {
	async handler() {
		const user = (await this.getUser())!;

		const payload = this.$_POST({
			taps: "Taps",
			time: "Time"
		});

		const newUser = await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				wallet: user.wallet + (user.tapLvl * +payload.taps),
				lastTap: new Date(+payload.time),
				energy: user.energy - (user.lvlInfo.energy * payload.taps)
			}
		})

		return  userDetails(newUser);
	}
}
