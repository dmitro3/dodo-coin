import DodoBot from './DodoBot';
import { DodoCommand } from './types/dodo';
import { Markup } from 'telegraf';
import DodoSession from './DodoSession';
import { env } from '../env';
import { log } from 'console';
import prisma from "@backend/modules/prisma/Prisma";
import {BotCommand} from "@telegraf/types";
import {User} from "@prisma/client";
import {sendInvite} from "@backend/api/player/send_invite/handler";
import { merge } from 'lodash';

class DodoClient extends DodoSession {

	async commands(): Promise<DodoCommand[]> {
		const ctx = this.ctx;
		const user = ctx?.telegram ? await prisma.user.findUnique({
			where: {
				id: ctx.from?.id
			}
		}) || ({} as User):{} as User;
		const startButton = [
			['Earn'],
			['Refs','Wallet'],
			['Withdraw','Help'],
		];


		return [
			{
				name:[ '/start','Home'],
				handler: async () => {
					await ctx.reply(`
					Hey, @${user.username}! Welcome to DodoCoin!
Tap on the coin and see your balance rise.

DodoCoin is a Decentralized Exchange on the Solana Blockchain. The biggest part of DodoCoin Token TAPS distribution will occur among the players here.

Got friends, relatives, co-workers?
Bring them all into the game.
More buddies, more coins.
					`, merge({
						...Markup.inlineKeyboard([
							Markup.button.webApp("Play!", getWebAppUrl(user))
						])
					}));
				},
				buttons: startButton,
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
DodoCoin is an addictive clicker game where you accumulate Shares by tapping the screen.

Leagues:
Climb the ranks by earning more Shares and outperforming others in the leagues.

Boosts:
Unlock boosts and complete tasks to maximize your Shares earnings.

Friends:
Invite others and both of you will receive bonuses. Assist your friends in advancing to higher leagues for bigger Shares rewards.

The Purpose:
Collect as many Shares as possible and exchange them for TAPS, DodoCoin Token on Solana Blockchain.

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
							Markup.button.webApp('Play!',url)
						])
					});
				}
			},
			{
				name: "Withdraw",
				async handler() {
					await ctx.reply(`
					Minimum Coin Required to send withdraw request: 100dodo
					
					Are you sure?
					`
						.split("\n")
						.map(s=>s.trim())
						.join("\n"),
						DodoBot.renderButtons([
							['Home','Send Withdraw Request']
						])
					)
				}
			},
			{
				name: "Send Withdraw Request",
				handler:async ()=> {
					if (user.wallet < 100) throw("Infusion Balance");

					const address = (await this.input("Enter wallet address")).text;
					const amount = +((await this.input('Enter Amount (min: 100):'))?.text || "");

					if (!address || isNaN(amount) || amount < 100) throw("Something Wrong!");


					/*TODO: Handle this*/
					await ctx.reply("Request Sent!")
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
