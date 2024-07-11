import {User} from "@prisma/client";
import {CryptoCurrency} from ".prisma/client";
import prisma from "@backend/modules/prisma/Prisma";
import CryptoManager from "@backend/crypto/CryptoManager";
import {getCurrencyManager} from "@backend/crypto/Managers";

export async function getWalletOfUser(user: User, symbol: keyof typeof CryptoCurrency) {
    if (!CryptoCurrency[symbol]) {
        throw new Error("Invalid CryptoCurrency");
    }

    const wallet = await prisma.cryptoWallet.findFirst({
        where: {
            symbol: symbol,
            userId: user?.id,
            type: "UserBalance",
            network: CryptoManager.getCurrentNetwork()
        }
    });

    if (wallet) {
        return wallet;
    } else {
        const wallet = await getCurrencyManager(symbol).createWallet();

        return await prisma.cryptoWallet.create({
            data: {
                userId: user?.id,
                address: wallet.address,
                type: "UserBalance",
                data: wallet,
                symbol,
                network: CryptoManager.getCurrentNetwork()
            }
        });
    }
}