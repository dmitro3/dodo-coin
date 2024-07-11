import {CryptoCurrency} from ".prisma/client";
import {getCurrencyManager} from "../src/backend/crypto/Managers";

describe('Wallet Creation', () => {
	for (let key of Object.keys(CryptoCurrency) as CryptoCurrency[]) {
		test(`Creation of ${key}`, async ()=>{
			return await getCurrencyManager(key).createWallet();
		})
	}
});
