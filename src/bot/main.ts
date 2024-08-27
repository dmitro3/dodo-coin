import {env} from './env';
import CustomTelegraf from './classes/CustomTelegraf';
import DodoAdmin from './classes/DodoAdmin';
import DodoClient from './classes/DodoClient';
import * as express from 'express';
import * as https from 'https';
import DodoBot from './classes/DodoBot';

import {error, log} from 'console';
import prisma from "@backend/modules/prisma/Prisma";
import { handleAd } from './ad';


function newBot(name: string, token: string) {
	return new CustomTelegraf(name, token);
}

export let CLIENT_BOT = newBot('DodoClient', env.CLIENT);
export let ADMIN_BOT = newBot('DodoAdmin', env.ADMIN);


export let DodoClientBot: DodoBot;
export let DodoAdminBot: DodoBot;

export async function StartDodoBot(): Promise<void> {
	if (process.env.NODE_ENV === "development") {

	}
	console.log('Waiting for prisma...');
	console.log('Prisma Connected', await prisma.user.count());
	await telegramInit()
}

export async function TerminateTelegramBot() {
	let errors: Error[] = [];
	const exec = async (func: () => Promise<any> | void) => {
		try {
			return await func();
		} catch (e: any) {
			errors.push(e);
		}
	}

	const bots = Object.values(global.CT_BOTS);
	for (const bot of bots) {

		try {
			await exec(() => bot.stop());

			for (const error of errors) {
				console.error(bot.id, "STOP ERROR", error?.message ?? error)
			}
			errors = [];
		} catch (e: any) {
			error("STOP ERROR", e?.message ?? e)
		}
	}
	global.CT_BOTS = {};
	await new Promise(r => setTimeout(r, 5000));
}

export async function RestartTelegramBot() {
	await TerminateTelegramBot();
	log("Starting Bots");
	CLIENT_BOT = newBot('DodoClient', env.CLIENT)
	ADMIN_BOT = newBot('DodoAdmin', env.ADMIN)
	await telegramInit();

}

let thread: ReturnType<typeof setInterval>;

async function telegramInit() {
	try {
		log("WAIT BOT(s) TO READY")
		ADMIN_BOT.onDisconnect(RestartTelegramBot)
		CLIENT_BOT.onDisconnect(RestartTelegramBot);
		await ADMIN_BOT.waitToReady();
		await CLIENT_BOT.waitToReady();
		log("READY")
		DodoAdminBot = new DodoBot(ADMIN_BOT, DodoAdmin);
		DodoClientBot = new DodoBot(CLIENT_BOT, DodoClient);

		clearInterval(thread);
		thread = setInterval(()=>{
			handleAd(DodoClientBot).catch(console.error)
		}, 12 * 60 * 60 * 1000);
		handleAd(DodoClientBot).catch(console.error);
	} catch (e) {
		log("BOT ERROR");
		console.error(e);
		await RestartTelegramBot()
	}
}


export function HotReloadTelegramBot() {
	log("BOT HOT RELOAD")
	RestartTelegramBot().catch(error).then(log)
}
