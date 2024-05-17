import {Context, NarrowedContext} from 'telegraf';
import {DodoCommand, TheMessageContext} from './types/dodo';
import DodoBot from './DodoBot';
import {BotCommand, CallbackQuery} from "@telegraf/types";
import {Update} from 'telegraf/types';

class DodoSession {
	ctx: TheMessageContext;
	dodoBot: DodoBot;

	constructor(ctx: TheMessageContext, bot: DodoBot) {
		this.ctx = ctx;
		this.dodoBot = bot;

	}

	async callBack(e:  NarrowedContext<Context<Update>, Update.CallbackQueryUpdate<CallbackQuery>>) {

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
		const final2 = [
			...final,
			...commands?.filter?.(c => !!c.menu?.length).map(c => (
				c.menu?.map(s => ({
					command: s.split(":")[0],
					description: s.split(":")[1]
				})).flat() || []
			))?.flat?.() || []
		]
		console.log(final2);
		return final2;
	}
}

export default DodoSession;
