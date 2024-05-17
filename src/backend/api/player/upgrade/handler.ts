import Handler from "@backend/modules/Handler";
import prisma from "@backend/modules/prisma/Prisma";
import {EnergyLevels, TapLevels, userDetails} from "@backend/api/login/handler";

export default class UpgradeHandler extends Handler {
	async handler() {
		let user = (await this.getUser())!;
		const type = this.get('type', "Type Required");

		if (type === "tap") {
			const lvl = Math.min(user.tapLvl+1, TapLevels.length);
			const lvlInfo = TapLevels[lvl-1];
			if (!lvlInfo) throw("Invalid LVL");
			if (lvlInfo.price > user.wallet) throw("IB");
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
			const lvl = Math.min(user.energyLvl+1, EnergyLevels.length);
			const lvlInfo = EnergyLevels[lvl-1];
			if (lvlInfo.price > user.wallet) throw("IB");

			user = await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					energyLvl: lvl,
					wallet: user.wallet - lvlInfo.price
				}
			})
		}

		return userDetails(user)
	}
}
