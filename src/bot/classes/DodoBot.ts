import CustomTelegraf from './CustomTelegraf';
import { Context, Markup } from 'telegraf';
import { DodoCommand, TheMessageContext } from './types/dodo';


import DodoSession from './DodoSession';
import { ParseMode } from 'telegraf/types';
import { log } from 'console';
import prisma from "@backend/modules/prisma/Prisma";

class DodoBot {
	bot: CustomTelegraf;
	sessionType: typeof DodoSession;
	inputsEvent: {
		[userId: number]: (ctx: TheMessageContext) => void
	} = {};
	isAdmin: boolean;


	constructor(bot: CustomTelegraf, sessionType: typeof DodoSession) {
		this.bot = bot;
		this.sessionType = sessionType;
		this.isAdmin = sessionType.name.includes('Admin');
		console.log(bot.me?.username, 'Registered as', sessionType.name);
		this.registerCommands();
	}

	registerCommands() {
		this.bot.onMessage(async (ctx) => {
			const telUser = ctx.from!;
			let user = await prisma.user.findUnique({
				where: {
					id: telUser.id,
				},
			}) || await prisma.user.findUnique({ where: { username: telUser.username } });
			try {
				if (!user && !this.isAdmin) {
					let refId;
					try {
						if (ctx?.text?.startsWith('/start')) {
							const fromUser = await prisma.user.findUnique(({
								where: {
									id: +(ctx?.text?.split(' ')?.pop() || "0"),
								},
							}));

							const amount = 10;

							if (fromUser) {
								await prisma.user.update({
									where: {
										id: +(fromUser.id),
									},
									data: {
										wallet: fromUser.wallet + amount,
									},
								});
								refId = fromUser.id
							}
						}
					}catch{}

					user = await prisma.user.create({
						data: {
							id: telUser.id,
							username: telUser.username,
							chatId: ctx.chat.id,
							refId
						},
					});
				}
			}
			catch (e) {
				console.error(e);
			}

			if (user?.blocked && !this.isAdmin) {
				await ctx.reply('This account blocked by administrator');
				return;
			}
			try {
				const inputEvent = this.inputsEvent[telUser.id];
				if (inputEvent) {
					inputEvent(ctx as TheMessageContext);
					delete this.inputsEvent[telUser.id];
					return;
				}

				const session = new this.sessionType(ctx as TheMessageContext, this);
				const commands = await session.commands();
				const notFound = async (ctx: Context) => {
					const buttons = commands.find(c =>
						!!c.buttons?.length,
					)?.buttons || [];

					if (buttons?.length) {
						await ctx.reply('Unknown Command', DodoBot.renderButtons(buttons));
					}
				};

				let text = ctx.text;
				if (text?.includes('/')) {
					text = text.split(' ')?.shift();
				}

				const cmd = commands.find(c => c.name === text || c.name?.includes?.(text+""));
				if (!cmd) {
					await notFound(ctx);
					return;
				}

				cmd.handler.bind(session)(ctx)?.catch?.((e: any) => {
					ctx.reply(e?.message ?? e).catch(console.error);
				});
			}
			catch (e: any) {
				await ctx.reply(e?.message ?? e);
				console.error(e);
			}
		});
	}


	static renderButtons(buttons: (string | string[])[]) {
		const column = buttons?.length % 2 === 0 ? 2 : 3;
		const row = Math.round(buttons.length / column);

		const final = Array.isArray(buttons?.[0]) ?
			buttons :
			Array.from({ length: row }).map((_, i) => {
				i++;
				const start = Math.round((i - 1) * column);
				const end = Math.round(i * column);

				return buttons.slice(start, end)
					.filter(o => typeof o === 'string')
					.map(b => Markup.button.text(b as string));
			});

		return {
			parse_mode: 'HTML' as ParseMode,
			...Markup.keyboard(final as string[]).oneTime(true).resize(true),
		};
	}

	async input(userId: number): Promise<TheMessageContext> {
		return new Promise(r => {
			this.inputsEvent[userId] = (ctx) => {
				r(ctx);
			};
		});
	}
}

export default DodoBot;
