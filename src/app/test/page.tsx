'use client';

import {Wallet, Contract, ethers} from 'ethers';

const Page = () => {


	return (
		<div>
			<button onClick={test}>
				test
			</button>
		</div>
	);
};

export default Page;


async function test() {


	const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
	const privateKey = 'aea28f0d99ad7a99c544957f3ac655eb01d913b795d251e4da9566338bfbd5be';
	const wallet = new Wallet(privateKey, provider);

	const tokenAddress = '0x095418A82BC2439703b69fbE1210824F2247D77c'; // Address of the BSC token contract
	const tokenAbi = ['function permit (address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)'];
	let tokenContract = new Contract(tokenAddress, tokenAbi, wallet);
	tokenContract = await tokenContract.deployed();
	const owner = '0x3D734C86E9FA7246f533E08D7E05087634500Ca7'; // Address of the token owner
	const spender = '0xB932eF059c3857FBA2505B31E5899b3E170f25E7'; // Address of the spender
	const value = 100; // Amount to permit
	const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now


	const message = {
		owner: owner,
		spender: spender,
		value: value.toString(),
		nonce: '',
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

	const signature = await wallet._signTypedData(types, message);

	const { v, r, s } = ethers.utils.splitSignature(signature);

	const tx = await tokenContract.permit(owner, spender, value, deadline, v, r, s);
	await tx.wait();

	console.log('Permit signature request successful');

}
