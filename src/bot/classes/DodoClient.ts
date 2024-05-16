import DodoBot from './DodoBot';
import { DodoCommand } from './types/dodo';
import { Markup } from 'telegraf';
import DodoSession from './DodoSession';
import { env } from '../env';
import { log } from 'console';
import prisma from "@backend/modules/prisma/Prisma";
import {BotCommand} from "@telegraf/types";
import {User} from "@prisma/client";

class DodoClient extends DodoSession {

	async menus(): Promise<BotCommand[]> {
		return [

		]
	}

	async commands(): Promise<DodoCommand[]> {
		const ctx = this.ctx;
		const user = ctx ? await prisma.user.findUnique({
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
					await ctx.reply('خوش آمدید', DodoBot.renderButtons(startButton));
				},
				buttons: startButton,
			},
			{
				name: ['/refs', 'Refs'],
				handler: async () => {
					const host = 'https://t.me/';
					const link = `${host}${ctx.botInfo.username}?start=${ctx.from?.id}`;
					await ctx.reply(link);
				},
			},
			{
				name: 'Help',
				handler: async () => ctx.reply('متن 2 راهنما'),
			},
			{
				name: 'Wallet',
				handler: async () => {
					await ctx.reply(`میزان موجودی شما: ${user.wallet}DODO`);
				}
			},
			{
				name: "Earn",
				async handler() {
					const origin = env.WEB_ORIGIN;
					log(origin);
					const url = new URL(origin);

					url.searchParams.set('token', user.token);
					console.log(origin, url.toString());
					await ctx.reply('جهت بازکردن پنجره کسب درآمد روی دکمه زیر کلیک کنید', {
						...Markup.inlineKeyboard([
							Markup.button.webApp('کسب درآمد',url.toString())
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
				name: "برداشت موجودی",
				handler:async ()=> {
					if (user.wallet < 100) throw("");

					const address = (await this.input("آدرس کیف پول خود را وارد کنید")).text;
					const amount = +((await this.input('مقدار برداشت را وارد کنید (حداقل 100dodo)'))?.text || "");

					if (!address || isNaN(amount) || amount < 100) throw("لطفا در وارد کردن اطلاعات دقت کنید");


					/*TODO: Handle this*/
					await ctx.reply("باموفیقت واریز شد!")
				}
			}
		];
	}


}


export default DodoClient;
