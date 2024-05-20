import {ADMIN_BOT, HotReloadTelegramBot} from "./bot/main";
import prisma from "@backend/modules/prisma/Prisma";


export async function register() {
	HotReloadTelegramBot();

	const origin = console.error;
	const admin = await prisma.user.findFirst({
		where: {
			username: "itzunity"
		}
	});

	console.log(`ADMIN LOG: @${admin?.username+""}`)

	console.error = (...args: any[])=>{
		origin(...args);
		ADMIN_BOT.waitToReady().then(async (me)=>{
			ADMIN_BOT.telegram.sendMessage(admin?.chatId+"", args.map(o => o+"").join("\n")).catch(origin);
		}).catch(origin);
	}
}
