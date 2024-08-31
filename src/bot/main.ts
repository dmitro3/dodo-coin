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

export let CLIENT_BOTS: CustomTelegraf[] = [];
export let ADMIN_BOT: CustomTelegraf;


export let DodoClients: DodoBot[] = [];
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


	const bots = global.CT_BOTS || {};
	for (const [id,bot] of Object.entries(bots)) {
		try {
			console.log(id,'STOPPED')
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
	ADMIN_BOT = undefined as any;
	await new Promise(r => setTimeout(r, 5000));
}

export async function RestartTelegramBot(e?: Error, T?: CustomTelegraf) {
	if (T?.id && !global.CT_BOTS[T?.id]) {
		console.log("DC IGNORED", T.id);
		return;
	}
	await TerminateTelegramBot();
	log("Starting Bots")


	await initClients();
	ADMIN_BOT ||= newBot('DodoAdmin', env.ADMIN);
	await telegramInit();
}

export async function initClients() {
	CLIENT_BOTS = [];
	const tokens = env.CLIENTS.split(" ");


	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const client = newBot(`DodoClient#${i}`, token);
		CLIENT_BOTS.push(client);
	}
}

let thread: ReturnType<typeof setInterval>;

async function telegramInit() {
	try {
		log("WAIT BOT(s) TO READY")
		ADMIN_BOT.onDisconnect(RestartTelegramBot)
		await ADMIN_BOT.waitToReady();
		DodoAdminBot = new DodoBot(ADMIN_BOT, DodoAdmin);

		DodoClients = [];
		for (let CLIENT_BOT of CLIENT_BOTS) {
			CLIENT_BOT.onDisconnect(RestartTelegramBot);
			await CLIENT_BOT.waitToReady();
			const client = new DodoBot(CLIENT_BOT, DodoClient)
			DodoClients.push(client);
		}



		clearInterval(thread);
		thread = setInterval(()=>{
			for (let dodoClient of DodoClients) {
				handleAd(dodoClient).catch(console.error)
			}
		}, 12 * 60 * 60 * 1000);
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
