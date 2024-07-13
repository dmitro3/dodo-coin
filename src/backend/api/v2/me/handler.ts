import Handler from "@backend/modules/Handler";
import {NextResponse} from "next/server";
import prisma, {ChargeLevels, EnergyLevels, Leagues, TapLevels} from "@backend/modules/prisma/Prisma";



export default class V2Login extends Handler {
    async handler() {
        const token = this.get('token', "Token Required");
        const user = await prisma.user.findUnique({
            where: {
                token: token+""
            }
        });
        if (!user) throw(401);
	   const res = NextResponse.json({
		   tron_balance: user.wallet,
		   shib_balance: user.wallet,
		   tronex_balance: user.wallet,
		   step: user.wallet,
		   power: user.wallet,
		   user: {
			   id: user.id
		   }
	   });
	   res.cookies.set('token', user.token, {
		   path: "/",
		   expires: new Date(Date.now() + 3600 * 60 * 60 * 1000).getTime()
	   });
        return res;
    }
}
