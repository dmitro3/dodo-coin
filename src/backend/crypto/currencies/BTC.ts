import CryptoManager from "@backend/crypto/CryptoManager";
import {Networks, PrivateKey} from "bitcore-lib";
import mainnet = Networks.mainnet;


// @ts-ignore
if (global._bitcore) delete global._bitcore;

export default class BTC extends CryptoManager {
    async createWallet(){
        const network = mainnet;
        let privateKey = new PrivateKey();
        // @ts-ignore
        let address = privateKey.toAddress(network);

        return {
            // @ts-ignore
            privateKey: privateKey.toString(network),
            // @ts-ignore
            address: address.toString(network)
        };
    }


    async getBalance(bitcoinAddress: string) {
        const apiUrl = `https://api.blockcypher.com/v1/btc/${this.TESTNET ? 'test3' : 'main'}/addrs/${bitcoinAddress}/balance`;

        return await fetch(apiUrl)
            .then(r => r.json())
            .then(response =>((+response?.balance) / 1e8) || 0)
    }
}
