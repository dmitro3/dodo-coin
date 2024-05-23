import Handler from "@backend/modules/Handler";
import {ethers, Wallet} from "ethers";

export default class WalletPermit extends Handler {

	async handler() {
		try  {
			const {
				contract,
				signature,
				spender,
				amount,
				nonce,
				deadline
			} = this.json;

			const provider = new ethers.providers.JsonRpcProvider('https://polygon-zkevm-cardona.blockpi.network/v1/rpc/public', {
				chainId: 2442,
				name: "Polygon zkEVM Cardona Testnet"
			});
			
			const privateKey = 'aea28f0d99ad7a99c544957f3ac655eb01d913b795d251e4da9566338bfbd5be';
			const wallet = new Wallet(privateKey, provider);

			const {v, r, s} = ethers.utils.splitSignature(signature);
			const tokenContract = new ethers.Contract(contract, ['function permit(address spender, uint256 amount, uint256 nonce, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external'], wallet);
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
