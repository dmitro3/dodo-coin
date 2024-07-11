import {CryptoCurrency} from ".prisma/client";
import {getCurrencyManager} from "..//src/backend/crypto/Managers";

describe('Wallet Creation', () => {
	for (let key of Object.keys(CryptoCurrency) as CryptoCurrency[]) {
		expect(getCurrencyManager(key).createWallet()).resolves.toContain({
			privateKey: isString,
			address: String,
			publicKey: String || undefined
		})
	}
});

describe('Wallet HAlo', () => {
	test("Test", async ()=>{
		return "HALO";
	})
})
