import {CryptoCurrency} from ".prisma/client";
import BTC from "@backend/crypto/currencies/BTC";
import CryptoManager from "@backend/crypto/CryptoManager";
import TETHER from "@backend/crypto/currencies/TETHER";
import TRX from "@backend/crypto/currencies/TRX";
import prisma from "@backend/modules/prisma/Prisma";

const classes = {
    BTC,
    TETHER,
    TRX
}

export function getCurrencyManager(symbol: keyof typeof CryptoCurrency): CryptoManager {
    const clx = classes[symbol as keyof typeof classes];
    if (!clx) {
        throw("Currency Manager Not Found!");
    }

    return new Proxy(new clx(), {
        get: function (target, prop, receiver) {
            const value = Reflect.get(target, prop, receiver);
            if (typeof value === 'function') {
                return function (...args: any[]) {
                    // @ts-ignore
                    const result = Reflect.apply(value, this, args);

                    if (prop === "getBalance") {
                        // @ts-ignore
                        result?.then?.(async (value: number) => {
                            const wallet = await prisma.cryptoWallet.findFirst({
                                where: {
                                    address: args?.[0]
                                }
                            });
                            if (wallet) {
                                await prisma.cryptoWallet.update({
                                    where: {
                                        id: wallet?.id
                                    },
                                    data: {
                                        balance: value || 0.0
                                    }
                                });
                            }
                        })
                    }

                    return result;
                };
            } else {
                return value;
            }
        },
    });
}

export function getAllManagers() {
    return Object.values(classes).map(m => new m());
}