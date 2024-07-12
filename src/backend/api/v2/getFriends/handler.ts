import Handler from "@backend/modules/Handler";
import {NextResponse} from "next/server";
import prisma, {ChargeLevels, EnergyLevels, Leagues, TapLevels} from "@backend/modules/prisma/Prisma";
import {PerFriendBonus} from "@/bot/classes/DodoBot";



export default class Friends extends Handler {
    async handler() {
        const user = await this.getUser();
	   if (!user) return {
		   friends: []
	   };
        const users = await prisma.user.findMany({
            where: {
                refId: user.id
            }
        });
	    console.log("HERE OK",users);
        return {
		   friends: users.map(u => ({
			   username: u.username,
			   bonus: PerFriendBonus,
			   self: user.username
		   }))
	   };
    }
}
