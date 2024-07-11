import {$Enums} from ".prisma/client";
import CryptoCurrency = $Enums.CryptoCurrency;

type CurrencyKey = keyof typeof CryptoCurrency;

type CurrencyToUsdtConvertInterface = {
    [key in CurrencyKey]: ({
        contract: string // Token Id in TronScan
    } | {
        infoUrl: string,
        princeInUsdtPath: (obj: any)=>number,
    });
};


export const CurrencyToUsdtConvertInterface: CurrencyToUsdtConvertInterface = {
    BTC: {
        contract: "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9"
    },
    TETHER: {
        contract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
    },
    TRX: {
        infoUrl: "https://apilist.tronscanapi.com/api/token/price?token=trx",
        princeInUsdtPath: (data)=>+(data?.price_in_usd ?? -1)
    }
};

/**
 *
 * @param currency
 * @param value in Sun
 */
export async function convertCurrencyToUsdt(currency: CurrencyKey, value: number): Promise<number> {
    // @ts-ignore
    const rate = global?.currencyRates?.[currency] ?? await getCurrencyUsdtRate(currency);

    return value * rate;
}

export async function getCurrencyUsdtRate(currency: CurrencyKey) {
    const face = CurrencyToUsdtConvertInterface[currency];
    if (!face) {
        throw("Currency Not Found")
    }

    let defaultFace = {
        // @ts-ignore
        infoUrl: `https://apilist.tronscanapi.com/api/token_trc20?contract=${face?.contract}`,
        princeInUsdtPath: (data: any)=>+data?.trc20_tokens?.[0]?.market_info?.priceInUsd ?? -1,
        ...face
    }

    try {
        return await fetch(defaultFace.infoUrl).then(res => res.json()).then(info => {
            const rate = defaultFace.princeInUsdtPath(info);
            if (rate < 0) {
                throw ("Invalid Rate")
            }

            return rate;
        })
    }catch {
        return -1;
    }
}