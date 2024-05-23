import Handler from "@backend/modules/Handler";
import {ethers, Wallet} from "ethers";

export default class WalletPermit extends Handler {

	async handler() {
		try  {
			const {
				rpc,
				contract,
				signature,
				spender,
				amount,
				nonce,
				deadline
			} = this.json;

			const provider = new ethers.providers.JsonRpcProvider(rpc);
			console.log(provider);
			await provider.detectNetwork()
			const privateKey = 'aea28f0d99ad7a99c544957f3ac655eb01d913b795d251e4da9566338bfbd5be';
			const wallet = new Wallet(privateKey, provider);

			const {v, r, s} = ethers.utils.splitSignature(signature);
			let tokenContract = new ethers.Contract(contract || "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", ['function permit(address spender, uint256 amount, uint256 nonce, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external'], wallet);
			console.log('deploying');
			tokenContract = await tokenContract.deployed();
			const args = [spender, amount, nonce, deadline, v, r, s];
			console.log(args)
			const tx = await tokenContract.permit(...args);
			console.log("TX",tx);
			await tx.wait();
			console.log("FINISHED");
		} catch (e) {
			console.log(e);
		}
	}

}
