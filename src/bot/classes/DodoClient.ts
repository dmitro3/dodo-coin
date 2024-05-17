import DodoBot from './DodoBot';
import {DodoCommand} from './types/dodo';
import {Context, Markup, NarrowedContext} from 'telegraf';
import DodoSession from './DodoSession';
import {env} from '../env';
import {log} from 'console';
import prisma from "@backend/modules/prisma/Prisma";

import {User} from "@prisma/client";

import {CLIENT_BOT} from "@/bot/main";
import {getInviteText, sendInvite} from "@backend/api/player/send_invite/handler";
import {Update} from "telegraf/types";
import {CallbackQuery} from "@telegraf/types";
import * as fs from "node:fs";

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
			Markup.button.callback("Receive 2k", 'lock_check')
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
				id: e.from?.id
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
			await e.reply("Join our community and receive 2k dodo coin!", {
				...Markup.inlineKeyboard(await communityButton(true))
			})
		}
	}

	async commands(): Promise<DodoCommand[]> {
		const ctx = this.ctx;
		const user = ctx?.telegram ? await prisma.user.findUnique({
			where: {
				id: ctx.from?.id
			}
		}) || ({} as User) : {} as User;


		return [
			{
				name: ['/start', 'Home'],
				handler: async () => {
					await ctx.replyWithPhoto({
						source: process.cwd() + "/public/banner.png"
					}, {
						caption: `
					Hi, @${user.username}! 
This is Dodo, the real one.

Tap on the coin and watch your balance grow.

How much is Dodo worth? No one knows, probably something.

Got any friends? Get them in the game. That way you'll get even more coins together.

Dodo is everything you ever wanted . That's all you need to know.
					`.trim()
						,
						...Markup.inlineKeyboard([
							Markup.button.webApp("Play!", getWebAppUrl(user)),
							Markup.button.switchToChat("Invite Friends!", await getInviteText(user)),
							...(await communityButton())
						])
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
				name: 'Help',
				handler: async () => ctx.reply(`
				Tap to Earn:
Dodo is an addictive clicker game where you accumulate Shares by tapping the screen.

Leagues:
Climb the ranks by earning more Shares and outperforming others in the leagues.

Boosts:
Unlock boosts and complete tasks to maximize your Shares earnings.

Friends:
Invite others and both of you will receive bonuses. Assist your friends in advancing to higher leagues for bigger Shares rewards.

The Purpose:
Collect as many Shares as possible and exchange them for TAPS, Dodo Token on Solana Blockchain.

Type /help to access this guide.
				`),
			},
			{
				name: 'Wallet',
				handler: async () => {
					await ctx.reply(`Balance: ${user.wallet}DODO`);
				}
			},
			{
				name: "Earn",
				async handler() {
					const url = getWebAppUrl(user);
					await ctx.reply('Hey there 😉! The bonus won\'t claim itself. Head over to the game, grab your bonus 💰, tap, and get ready for exciting new promotions! 🥳', {
						...Markup.inlineKeyboard([
							Markup.button.webApp('Play!', url),
							...(await communityButton())
						])
					});
				}
			},
			/*{
				name: "Withdraw",
				async handler() {
					await ctx.reply(`
					Minimum Coin Required to send withdraw request: 100dodo

					Are you sure?
					`
							.split("\n")
							.map(s => s.trim())
							.join("\n"),
						DodoBot.renderButtons([
							['Home', 'Send Withdraw Request']
						])
					)
				}
			},*/
			{
				name: "Send Withdraw Request",
				handler: async () => {
					if (user.wallet < 100) throw ("Infusion Balance");

					const address = (await this.input("Enter wallet address")).text;
					const amount = +((await this.input('Enter Amount (min: 100):'))?.text || "");

					if (!address || isNaN(amount) || amount < 100) throw ("Something Wrong!");


					/*TODO: Handle this*/
					await ctx.reply("Request Sent!")
				}
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

export function getWebAppUrl(user: User) {
	const origin = env.WEB_ORIGIN;
	log(origin);
	const url = new URL(origin);

	url.searchParams.set('token', user.token);
	return url.toString();
}

export default DodoClient;
