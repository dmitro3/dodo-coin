import Handler from "@backend/modules/Handler";
import {NextResponse} from "next/server";
import prisma, {ChargeLevels, EnergyLevels, Leagues, TapLevels} from "@backend/modules/prisma/Prisma";
import {PerFriendBonus} from "@/bot/classes/DodoBot";



export default class V2Login extends Handler {
    async handler() {
        const user = await this.getUser();
	   if (!user) return [];

        const users = await prisma.user.findMany({
            where: {
                refId: user?.id
            }
        });
        if (!user) throw(401);
        return {
		   friends: users.map(u => ({
			   username: u.username,
			   bonus: PerFriendBonus
		   }))
	   };
    }
}
