import DodoBot from './DodoBot';
import DodoSession from './DodoSession';

import {CLIENT_BOTS, DodoAdminBot, DodoClients} from '../main';
import prisma from "@backend/modules/prisma/Prisma";
import {TheMessageContext} from "@/bot/classes/types/dodo";
import {Markup} from "telegraf";
import {env} from "@/bot/env";

export const DodoAdmins = [6629569837, 1016434018, 5642287166];

class DodoAdmin extends DodoSession {
	admins = DodoAdmins;

	async commands() {
		const ctx = this.ctx;
		const startButtons = [
			'Stats',
			'Add Coin',
			'Remove Coin',
			'Block',
			'Unblock',
			'Twitter Lock',
			'Channel Lock',
			'Forwarder',
		];
		const user = await prisma.user.findUnique({
			where: {
				id: ctx.from?.id || -1
			}
		})
		const reply = async (txt: string) => {
			return ctx.reply(txt);
		};
		const id = !!ctx ? ctx.from?.id || ctx.update?.message?.from?.id || ctx.chat?.id : -1;
		if (!!id && !this.admins.includes(id)) {
			console.error('ACCESS DENIED', id)
			return [];
		}

		return [
			{
				name: 'Panel',
				handler: async () => {
					await ctx.reply('Admin Panel', DodoBot.renderButtons(startButtons));
				},
				buttons: startButtons,
			},
			{
				name: ['Block', 'Unblock'],
				menu: ['block:Block User', 'unblock:Unblock User'],
				handler: async () => {
					const username = (await this.input('Enter target username'))
						?.text
						?.replace('@', '');
					const user = await prisma.user.findFirst(({
						where: {
							username: username + "",
						},
					}));

					if (!user) {
						await reply('User not found');
						return;
					}

					const newUser = await prisma.user.update({
						where: {
							id: user.id
						},
						data: {
							blocked: !user.blocked
						}
					});

					await reply(`User has been ${newUser.blocked ? 'block' : 'Unblock'}ed`);
				},
			},
			{
				name: 'Stats',
				handler: async () => {
					await reply(`User Count: ${await prisma.user.count()}`);
				}
			},
			{
				name: 'Forwarder',
				handler: async () => {
					const ctxFromUser = await this
						.input('Send your message to forward to all members(or cancel)');
					const msg = ctxFromUser.message;
					const adminTelegram = DodoAdminBot.bot.telegram;
					if (msg?.text?.includes?.('cancel')) return;
					const url = msg.photo?.length ? (await adminTelegram.getFileLink(msg.photo.pop()
						.file_id))
						.toString() : null;
					const users = await prisma.user.findMany();

					for (let client of CLIENT_BOTS) {
						const clientTelegram = client.telegram;

						let FirstUploaded: any | null;
						let start = 0;
						let take = 50;
						let thread: ReturnType<typeof setInterval>;

						const doForward = async () => {
							const to = start + take;
							const array = users?.slice?.(start, to);
							if (!array?.length && thread) {
								clearInterval(thread);
								await ctx.reply(`Forwarded to ${users?.length} successful`);
								return;
							}
							for (const user of array) {
								try {
									if (url) {
										FirstUploaded = await clientTelegram
											.sendPhoto(user.chatId, FirstUploaded ? (FirstUploaded?.photo?.shift?.()?.file_id + "") : {
												url
											}, {
												caption: msg.caption
											}).catch(() => undefined);
									} else {
										await clientTelegram.sendMessage(user.chatId, msg.text).catch(() => undefined);
									}
								} catch (e) {
									console.error(e);
								}
							}
							await ctx.reply(`Forwarded to ${array?.length + start}/${users.length}`)
							start += take;
						}
						await doForward();
						thread = setInterval(doForward, 30 * 1000);
					}
				}
			},
			{
				name: ['add_coin', 'remove_coin', 'coin'],
				menu: ['add_coin:Add Coin to User', 'remove_coin:Remove Coin From User'],
				handler: async () => {
					const username = (await this.input('Enter target username:')).text;
					const user = await prisma.user.findFirst(({
						where: {
							username: username + ""
						}
					}));
					if (!user) throw ("Doesn't exist");

					await reply(`User Balance: ${user.wallet}`);

					const amount = +((await this.input('Enter Coin Amount'))?.text || "");
					if (isNaN(amount)) throw ("Please enter valid number");

					const decrease = ctx.text?.includes('remove');
					const final = Math.max(0, decrease ? user.wallet - amount : user.wallet + amount);
					await prisma.user.update({
						where: {
							id: user.id
						},
						data: {
							wallet: final
						}
					});
					await reply(`The Operation was Successful. ${decrease ? '-' : '+'}${amount}dodo\nUser Balance:${final}`);
				}
			},
			{
				name: "v2",
				handler(e: TheMessageContext) {
					const token = user?.token();
					const url = new URL(env.WEB_ORIGIN);
					url.pathname = "/";
					url.search = `?token=${token}`;

					const url2 = new URL(url);
					url2.pathname = "/adminPanel";

					e.reply("Dodo V2", {
						...Markup.inlineKeyboard([
							[
								Markup.button.webApp("Open Dodo[v2]", url.toString()),
								Markup.button.webApp("Open Dodo[v2] (AdminPanel)", url2.toString())
							],
							[
								Markup.button.url("Open Dodo[v2]", url.toString()),
								Markup.button.url("Open Dodo[v2] (AdminPanel)", url2.toString()),
							]
						])
					})
				}
			}
		];
	}
}

export default DodoAdmin;
