import CustomTelegraf from './CustomTelegraf';
import {Markup} from 'telegraf';
import {TheMessageContext} from './types/dodo';


import DodoSession from './DodoSession';
import {ParseMode} from 'telegraf/types';
import {error} from 'console';
import prisma from "@backend/modules/prisma/Prisma";

class DodoBot {
	bot: CustomTelegraf;
	sessionType: typeof DodoSession;
	inputsEvent: {
		[userId: number]: (ctx: TheMessageContext) => void
	} = {};
	isAdmin: boolean;
	variables: {
		[key: string]: any
	} = {}

	constructor(bot: CustomTelegraf, sessionType: typeof DodoSession) {
		this.bot = bot;
		this.sessionType = sessionType;
		this.isAdmin = sessionType.name.includes('Admin');
		console.log(bot.me?.username, 'Registered as', sessionType.name);
		this.registerCommands();

		console.log('Registering Commands...');
		const tempSession = new sessionType({} as unknown as TheMessageContext, {} as unknown as DodoBot);
		tempSession.menus().then(commands => {
			this.bot.telegram.setMyCommands(commands).catch(error)
		})
		this.variables = {};
	}

	registerCommands() {
		this.bot.on('callback_query', (e)=>{
			const session = new this.sessionType(e as any,this);
			session.callBack(e as any).catch(error);
		})
		this.bot.onMessage(async (ctx) => {

			let telUser = {...((ctx.from || ctx?.update?.message?.from || ctx?.chat?.from || ctx?.message?.from) || {})};
			if(!telUser || !telUser?.id) {
				console.error("USER NOT FOUND");
				return;
			}

			telUser.username ||= telUser?.first_name || telUser?.last_name || telUser?.name
			let user = await prisma.user.findUnique({
				where: {
					id: +(telUser.id || ""),
				},
			});
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
					} catch {
					}

					user = await prisma.user.create({
						data: {
							id: telUser.id,
							username: telUser.username,
							chatId: ctx.chat.id,
							refId
						},
					});
				}
			} catch (e) {
				console.error(e);
			}

			if (user?.blocked && !this.isAdmin) {
				await ctx.reply('This account blocked by administrator');
				return;
			}
			const start = new Date();
			try {
				const inputEvent = this.inputsEvent[telUser.id];
				if (inputEvent) {
					inputEvent(ctx as TheMessageContext);
					delete this.inputsEvent[telUser.id];
					return;
				}

				const session = new this.sessionType(ctx as TheMessageContext, this);
				const commands = await session.finalCommands();

				let text = ctx.text ?? ctx?.message?.text;
				if (text?.includes('/')) {
					text = text.split(' ')?.shift();
				}

				const cmd = commands.find(c => c.name === text || c.name?.includes?.(text + "")) || commands.find(c =>
					!!c.menu?.find(s => s.includes(text.replace("/","")))
				);
				if (!cmd) return;

				cmd.handler.bind(session)(ctx)?.then?.(()=>{
					console.log(`EXECUTE TOOK [${(new Date().getTime() - start.getTime()) / 1000}s] => ${user?.username} ${ctx?.text}`);
				})?.catch?.((e: any) => {
					ctx.reply(e?.message ?? e).catch(console.error);
				});
			} catch (e: any) {
				console.error(e);
				ctx.reply(e?.message ?? e).catch(console.error);
			}

		});
	}


	static renderButtons(buttons: (string | string[])[]) {
		const column = buttons?.length % 2 === 0 ? 2 : 3;
		const row = Math.round(buttons.length / column);

		const final = Array.isArray(buttons?.[0]) ?
			buttons :
			Array.from({length: row}).map((_, i) => {
				i++;
				const start = Math.round((i - 1) * column);
				const end = Math.round(i * column);

				return buttons.slice(start, end)
					.filter(o => typeof o === 'string')
					.map(b => Markup.button.text(b as string));
			});

		return {
			parse_mode: 'HTML' as ParseMode,
			...Markup.keyboard(final as string[]).oneTime().resize(true),
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
