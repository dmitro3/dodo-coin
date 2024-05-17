import Handler from "@backend/modules/Handler";
import prisma from "@backend/modules/prisma/Prisma";
import {TapLevels, userDetails} from "@backend/api/login/handler";

export default class UpgradeHandler extends Handler {
	async handler() {
		let user = (await this.getUser())!;
		const type = this.get('type', "Type Required");

		if (type === "tap") {
			const lvl = Math.min(user.tapLvl+1, TapLevels.length);
			const lvlInfo = TapLevels[lvl-1];
			if (!lvlInfo) throw("Invalid LVL");

			user = await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					tapLvl: lvl,
					wallet: user.wallet - lvlInfo?.price
				}
			})
		} else if (type === "charge") {
			if (user.energy === user.maxEnergy) throw("Already Full")
			user = await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					energy: user.maxEnergy,
					wallet: user.wallet - 2000
				}
			})
		}

		return userDetails(user)
	}
}
