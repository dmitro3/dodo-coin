import { Context } from 'telegraf';
import { DodoCommand, TheMessageContext } from './types/dodo';
import DodoBot from './DodoBot';
import { User } from '@prisma/client';
import {BotCommand} from "@telegraf/types";

class DodoSession {
	ctx: TheMessageContext;
	dodoBot: DodoBot;

	constructor(ctx: TheMessageContext, bot: DodoBot) {
		this.ctx = ctx;
		this.dodoBot = bot;

	}


	async input(txt: string): Promise<TheMessageContext> {
		await this.ctx.reply(txt);
		return new Promise(r => {
			this.dodoBot.input(this.ctx.from?.id || 0).then(r).catch(console.error);
		});
	}

	async commands(): Promise<DodoCommand[]> {
		return [];
	}

	async menus(): Promise<BotCommand[]> {

	}
}

export default DodoSession;
