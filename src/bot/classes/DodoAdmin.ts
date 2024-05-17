import DodoBot from './DodoBot';
import DodoSession from './DodoSession';

import {CLIENT_BOT, DodoAdminBot, DodoClientBot} from '../main';
import prisma from "@backend/modules/prisma/Prisma";
import {TheMessageContext} from "@/bot/classes/types/dodo";

class DodoAdmin extends DodoSession {
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
		const reply = async (txt: string) => {
			return ctx.reply(txt);
		};

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
				handler: async () => {
					const username = (await this.input('Enter target username'))
						?.text
						?.replace('@', '');
					const user = await prisma.user.findUnique(({
						where: {
							username,
						},
					}));

					if (!user) {
						await reply('User not found');
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

					await reply(`User has been ${newUser.blocked ? 'block':'Unblock'}ed`);
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
				handler: async ()=>{
					const ctxFromUser = await this
						.input('Send your message to forward to all members(or cancel)');
					const msg = ctxFromUser.message;
					const clientTelegram = DodoClientBot.bot.telegram;
					const adminTelegram = DodoAdminBot.bot.telegram;
					if (msg.text.includes('cancel')) return;
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
				name: ['Add Coin','Remove Coin'],
				handler: async ()=>{
					const username = (await this.input('Enter target username:')).text;
					const user = await prisma.user.findUnique(({
						where: {
							username
						}
					}));
					if (!user) throw("Doesn't exist");

					await reply(`User Balance: ${user.wallet}`);

					const amount = +((await this.input('Enter Coin Amount'))?.text || "");
					if (isNaN(amount)) throw("Please enter valid number");

					const decrease = ctx.text?.includes('Add');
					const final = decrease ? user.wallet - amount:user.wallet + amount;

					await prisma.user.update({
						where: {
							username
						},
						data: {
							wallet: Math.max(0, final)
						}
					});
					await reply(`The Operation was Successful. ${decrease? '-':'+'}${final}dodo`);
				}
			},
			{
				name: "Lock",
				handler: async (etx: TheMessageContext) => {
					await CLIENT_BOT.waitToReady();
					const enabled = await CLIENT_BOT.getSetting('CHANNEL_LOCK');

					if (enabled) {
						const channel = await prisma.botChannel.findFirst({
							where: {
								botUsername: CLIENT_BOT.me?.username+"",
								OR: [
									{
										channelId: enabled+""
									},
									{
										chatId: enabled+""
									}
								]
							}
						});
						if (channel) {
							await ctx.reply(`Channel Lock Enabled on ${channel.title}`)
						}
					}

					const channels = await prisma.botChannel.findMany({
						where: {
							botUsername: CLIENT_BOT.me?.username+""
						}
					});
					await ctx.reply(`
					Channel List:
					${channels.map((c,i) => `${i+1}. ${c.title}`).join('\n')}
					
					Note: if channel doesn't exists its means the bot doesn't receive any message from that channel
					`.trim().replaceAll("  ", ""))

					const input = await this.input("Enter Channel Number to enable or type (cancel) to disable:");

					const target = channels?.[+input];
					if (target) {
						await CLIENT_BOT.setSetting('CHANNEL_LOCK', target.channelId);
						await ctx.reply(`Channel Lock enabled on ${target.title}`);
					} else {
						await prisma.botSetting.delete({
							where: {
								botUsername_key: {
									key: "CHANNEL_LOCK",
									botUsername: CLIENT_BOT.me?.username+""
								}
							}
						})
					}
				}
			}
		];
	}
}

export default DodoAdmin;
