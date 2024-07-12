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
	   const inviter = await prisma.user.findUnique({
		   where: {
			   id: user.refId || -1
		   }
	   })
        return {
		   friends: users.map(u => ({
			   username: u.username,
			   bonus: PerFriendBonus
		   })),
		   inviter: inviter?.username
	   };
    }
}
