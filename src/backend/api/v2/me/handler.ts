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
        return user;
    }
}
