import DodoBot from './DodoBot';
import DodoSession from './DodoSession';

import { DodoAdminBot, DodoClientBot } from '../main';
import prisma from "@backend/modules/prisma/Prisma";

class DodoAdmin extends DodoSession {
	async commands() {
		const ctx = this.ctx;
		const startButtons = [
			'امار ربات',
			'اعطای کوین',
			'حذف کوین',
			'بلاک کاربر',
			'انبلاک کاربر',
			'قفل توییتر',
			'قفل کانال',
			'ارسال و فروارد همگانی',
		];
		const reply = async (txt: string) => {
			return ctx.reply(txt);
		};

		return [
			{
				name: '/start',
				handler: async () => {
					await ctx.reply('پنل ادمین', DodoBot.renderButtons(startButtons));
				},
				buttons: startButtons,
			},
			{
				name: 'افزایش موجودی',
				handler: () => {

				},
			},
			{
				name: ['بلاک کاربر', 'انبلاک کاربر'],
				handler: async () => {
					const username = (await this.input('نام کاربری فرد مورد نظر را وارد کنید'))
						?.text
						?.replace('@', '');
					const user = await prisma.user.findUnique(({
						where: {
							username,
						},
					}));

					if (!user) {
						await reply('کاربر مورد نظر یافت نشد');
						return;
					}

					const newUser = await prisma.user.update({
						where: {
							username
						},
						data: {
							blocked: !user.blocked
						}
					});

					await reply(`کاربر باموفقیت ${newUser.blocked ? 'بلاک':'انبلاک'} شد`);
				},
			},
			{
				name: 'امار ربات',
				handler: async () => {
					await reply(`تعداد کاربران: ${await prisma.user.count()}`);
				}
			},
			{
				name: 'ارسال و فروارد همگانی',
				handler: async ()=>{
					const ctxFromUser = await this
						.input('پیغام خود را جهت ارسال به تمام کاربران ارسال کنید');
					const msg = ctxFromUser.message;
					const clientTelegram = DodoClientBot.bot.telegram;
					const adminTelegram = DodoAdminBot.bot.telegram;

					const url = msg.photo?.length ? (await adminTelegram.getFileLink(msg.photo.pop()
						.file_id))
						.toString():null;

					for (const user of (await prisma.user.findMany())) {
						try {
							if (url) {
								await clientTelegram
									.sendPhoto(user.chatId, {
										url
									}, {
										caption: msg.caption
									});
							}
							else {
								await clientTelegram.sendMessage(user.chatId, msg.text);
							}
						}
						catch (e) {
							console.error(e);
						}
					}
				}
			},
			{
				name: ['اعطای کوین','حذف کوین'],
				handler: async ()=>{
					const username = (await this.input('نام کاربر مورد نظر را وارد کنید')).text;
					const user = await prisma.user.findUnique(({
						where: {
							username
						}
					}));
					if (!user) throw('کاربر یافت نشد');

					await reply(`میزان اعتبار ارزی کاربر: ${user.wallet}`);

					const amount = +((await this.input('تعداد ارز مورد نظر'))?.text || "");
					if (isNaN(amount)) throw('لطفا عدد را به انگلیسی تایپ کنید');

					const decrease = ctx.text?.includes('حذف');
					const final = decrease ? user.wallet - amount:user.wallet + amount;

					await prisma.user.update({
						where: {
							username
						},
						data: {
							wallet: Math.max(0, final)
						}
					});
					await reply(`باموفقیت تعداد ارز مورد نظر ${decrease? 'کم':'اضافه'} شد`);
				}
			}
		];
	}
}

export default DodoAdmin;
