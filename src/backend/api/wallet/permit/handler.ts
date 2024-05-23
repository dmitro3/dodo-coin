import Handler from "@backend/modules/Handler";

export default class WalletPermit extends Handler {

	async handler() {
		const {
			contract,
			signature,
			spender,
			amount,
			nonce,
			deadline
		} = this.json;
		
	}

}
