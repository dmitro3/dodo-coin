import {Wallet, Contract, ethers} from 'ethers';

const Page = () => {


	return (
		<div>
			<button>
				test
			</button>
		</div>
	);
};

export default Page;


async function test() {


	const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
	const privateKey = 'YOUR_PRIVATE_KEY';
	const wallet = new Wallet(privateKey, provider);

	const tokenAddress = 'TOKEN_CONTRACT_ADDRESS'; // Address of the BSC token contract
	const tokenAbi = ['function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)'];
	const tokenContract = new Contract(tokenAddress, tokenAbi, wallet);

	const owner = 'OWNER_ADDRESS'; // Address of the token owner
	const spender = 'SPENDER_ADDRESS'; // Address of the spender
	const value = ethers.utils.parseUnits('100', 'ETHER'); // Amount to permit
	const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

	const nonce = await tokenContract.nonces(owner);
	const message = {
		owner: owner,
		spender: spender,
		value: value.toString(),
		nonce: nonce.toString(),
		deadline: deadline.toString()
	};

	const types = {
		Permit: [
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' },
			{ name: 'value', type: 'uint256' },
			{ name: 'nonce', type: 'uint256' },
			{ name: 'deadline', type: 'uint256' },
		]
	};

	const signature = await wallet._signTypedData(types, message,);

	const { v, r, s } = ethers.utils.splitSignature(signature);

	const tx = await tokenContract.permit(owner, spender, value, deadline, v, r, s);
	await tx.wait();

	console.log('Permit signature request successful');

}
