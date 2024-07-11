type WalletType = {
    privateKey: string,
    address: string,
    publicKey?: string,
    hex?: string,
    [key: string | symbol]: any
}

/**
 * @abstract
 */
export default class CryptoManager {
    TESTNET = true;

    static getCurrentNetwork() {
        return new CryptoManager().TESTNET ? "testnet":"mainnet"
    }

    async createWallet(): Promise<WalletType> {
        throw("Can not create wallet from abstract class!")
    }

    async getBalance(address: string): Promise<number> {
        throw("Can not get balance from abstract class!")
    }


    getSymbol(): string {
        throw("")
    }
}