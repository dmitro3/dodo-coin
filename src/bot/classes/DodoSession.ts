import {Context, NarrowedContext} from 'telegraf';
import { DodoCommand, TheMessageContext } from './types/dodo';
import DodoBot from './DodoBot';
import { User } from '@prisma/client';
import {BotCommand, CallbackQuery} from "@telegraf/types";
import {Update} from "telegraf/typings/core/types/typegram";

class DodoSession {
	ctx: TheMessageContext;
	dodoBot: DodoBot;

	constructor(ctx: TheMessageContext, bot: DodoBot) {
		this.ctx = ctx;
		this.dodoBot = bot;

	}

	callBack(e:  NarrowedContext<Context<Update>, Update.CallbackQueryUpdate<CallbackQuery>>) {
		if (e.callbackQuery === 'lock_check')
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

	async finalCommands(): Promise<DodoCommand[]> {
		const commands = await this.commands();

		return commands.map(c => {
			let name = typeof c.name === 'string' ? [c.name]:c.name;
			const target = name.at(-1);
			name.push(`/${target?.toLowerCase()}`);

			return {
				...c,
				name
			}
		});
	}

	async menus(): Promise<BotCommand[]> {
		const commands = await this.commands();
		const lastItem = (c: DodoCommand) => (typeof c.name === 'string' ? [c.name]:c.name)?.at?.(-1);
		const final = commands.filter(c => !lastItem(c)?.includes(" ")).map(c => {
			const last = lastItem(c) || "404"
			return  ({
				command: last.toLowerCase(),
				description:last
			})
		});
		console.log(final);
		return final;
	}
}

export default DodoSession;
