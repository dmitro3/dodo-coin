import TETHER from "@backend/crypto/currencies/TETHER";
// @ts-ignore
import TronWeb from 'tronweb';

export default class TRX extends TETHER {

    async getBalance(address: string) {
        const tronWeb = new TronWeb({
            fullHost: this.TESTNET ? "https://api.shasta.trongrid.io":'https://api.trongrid.io',
            headers: {
                "TRON-PRO-API-KEY": "39d04d37-98d9-4f7b-8925-ac87c3990f02",
            },
        })
        const ac = await tronWeb.trx.getAccount(address);

        return (+ac.balance / 1e6) || 0;
    }

}