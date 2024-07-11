import BTC from "@backend/crypto/currencies/BTC";
import {getCurrencyManager} from "@backend/crypto/Managers";

getCurrencyManager("BTC").createWallet().then(console.log);
