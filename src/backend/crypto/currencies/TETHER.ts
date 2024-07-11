import CryptoManager from "@backend/crypto/CryptoManager";
import TronWeb from 'tronweb';
import {CurrencyToUsdtConvertInterface} from "@backend/crypto/currency";

export default class TETHER extends CryptoManager {

    async createWallet() {

        const tronWeb = new TronWeb({
            fullHost: this.TESTNET ? "https://api.shasta.trongrid.io":'https://api.trongrid.io',
        });

        const wallet= await tronWeb?.createAccount();

        return {
            ...wallet,
            address: wallet?.address?.base58,
        };
    }

    async getBalance(account: string) {
        // @ts-ignore
        const CONTRACT = this.TESTNET ? "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs":CurrencyToUsdtConvertInterface.TETHER.contract;
        const tronWeb = new TronWeb({
            fullHost: this.TESTNET ? "https://api.shasta.trongrid.io":'https://api.trongrid.io',
            headers: {
                "TRON-PRO-API-KEY": "39d04d37-98d9-4f7b-8925-ac87c3990f02",
            },
        })
        tronWeb.setAddress(account);
        const {
            abi
        } = await tronWeb.trx.getContract(CONTRACT);

        const contract = tronWeb.contract(abi.entrys, CONTRACT);

        const balance = await contract.balanceOf(account).call();
        return ((+balance.toString()) / 1e6) || 0;

    }

}
