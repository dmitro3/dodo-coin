import Handler from "@backend/modules/Handler";
import {NextResponse} from "next/server";
import prisma, {ChargeLevels, EnergyLevels, Leagues, TapLevels} from "@backend/modules/prisma/Prisma";



export default class V2Login extends Handler {
    async handler() {
        const token = this.getUser();
        const user = await prisma.user.findUnique({
            where: {
                refId:
            }
        });
        if (!user) throw(401);
        return {
		   tron_balance: user.tron_balance+"",
		   shib_balance: user.shib_balance+"",
		   tronex_balance: user.tronex_balance+"",
		   step: user.step+"",
		   power: user.power+"",
		   user
	   };
    }
}
