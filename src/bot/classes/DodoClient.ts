import DodoBot from './DodoBot';
import { DodoCommand } from './types/dodo';
import { Markup } from 'telegraf';
import DodoSession from './DodoSession';
import { env } from '../env';
import { log } from 'console';
import prisma from "@backend/modules/prisma/Prisma";

class DodoClient extends DodoSession {
	async commands(): Promise<DodoCommand[]> {
		const ctx = this.ctx;
		const user = await prisma.user.findUnique({
			where: {
				id: ctx.from?.id
			}
		});
		const startButton = [
			['Earn'],
			['Refs','Wallet'],
			['برداشت','Help'],
		];
		if (!user) return [];

		return [
			{
				name:[ '/start','بازگشت'],
				handler: async () => {
					await ctx.reply('خوش آمدید', DodoBot.renderButtons(startButton));
				},
				buttons: startButton,
			},
			{
				name: 'زیر مجموعه گیری',
				handler: async () => {
					const host = 'https://t.me/';
					const link = `${host}${ctx.botInfo.username}?start=${ctx.from?.id}`;
					await ctx.reply(link);
				},
			},
			{
				name: 'راهنما',
				handler: async () => ctx.reply('متن 2 راهنما'),
			},
			{
				name: 'کیف پول',
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
				name: "برداشت",
				async handler() {
					await ctx.reply(`
					💸 توجه داشته باشید حداقل برداشت موجودی dodo100 می‌باشد.

برای برداشت موجودی خود روی دکمه زیر کلیک کنید 👇
					`
						.split("\n")
						.map(s=>s.trim())
						.join("\n"),
						DodoBot.renderButtons([
							['بازگشت','برداشت موجودی']
						])
					)
				}
			},
			{
				name: "برداشت موجودی",
				handler:async ()=> {
					if (user.wallet < 100) throw("موجودی حساب شما کافی نمیباشد");

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
