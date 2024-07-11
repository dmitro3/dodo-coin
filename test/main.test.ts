import {CryptoCurrency} from ".prisma/client";
import {getCurrencyManager} from "..//src/backend/crypto/Managers";

describe('Wallet Creation', () => {
	for (let key of Object.keys(CryptoCurrency) as CryptoCurrency[]) {
		it(`Creation of ${key}`, async ()=>{

			return (await getCurrencyManager(key).createWallet()).address
		})
	}
});

describe('Wallet Creation', () => {
	test("Test", async ()=>{
		return "HALO";
	})
})
