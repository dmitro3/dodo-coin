'use client';
import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount, useBalance, useDisconnect, useSendTransaction, useSignMessage} from "wagmi";
import {parseEther} from "viem";
import {getBalance, signTypedData} from "@wagmi/core";
import {config} from "@/context/config";
import {ethers, formatUnits} from "ethers";
import {useState} from "react";

const BNBContract = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
const developer = {
	address: "0xB932eF059c3857FBA2505B31E5899b3E170f25E7"
}

const Page = () => {
	const open = useWeb3Modal();
	const wallet = useWalletInfo();
	const account = useAccount();
	const { signMessage } = useSignMessage();
	const { sendTransaction } = useSendTransaction()
	const {disconnect} = useDisconnect();
	const {data: balance, isLoading} = useBalance({
		address: account.address
	});
	const [signature, setSignature] = useState<string | undefined>()

	if (isLoading || !balance || !account) return "LOADING";

	const message = {
		"owner": account.address!,
		"spender": developer.address!,
		"value": "100000000000",
		"nonce": 0,
		"deadline": 1625256000
	} as any;

	return (
		<div>
			<button onClick={() => open.open()}>
				open
			</button>
			<img src={wallet.walletInfo?.icon}/>
			<br/>
			<button onClick={() => {
				console.log(signMessage({
					message: "test",
				}))
			}}>Sign Message
			</button>
			<br/>
			{account.isConnected + ""}
			<br/>
			{account.address}
			<br/>
			{account.chainId}
			<br/>
			<button
				onClick={() => sendTransaction({
					gas: null,
					to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
					value: parseEther('0.0001'),
				})}
			>
				Transfer
			</button>
			<button onClick={disconnect as any}>
				DC

			</button>
			<button onClick={async ()=>{
				if (!account) return;
				const result = await signTypedData(config, {
						"types": {
							"EIP712Domain": [
								{ "name": "name", "type": "string" },
								{ "name": "version", "type": "string" },
								{ "name": "chainId", "type": "uint256" },
								{ "name": "verifyingContract", "type": "address" }
							],
							"Permit": [
								{ "name": "owner", "type": "address" },
								{ "name": "spender", "type": "address" },
								{ "name": "value", "type": "uint256" },
								{ "name": "nonce", "type": "uint256" },
								{ "name": "deadline", "type": "uint256" }
							]
						},
						"primaryType": "Permit",
						"domain": {
							"name": balance.symbol,
							"version": "1",
							"chainId": account.chainId as any,
							"verifyingContract": BNBContract // BNB Contract
						},
						"message": message
					}
				)

				setSignature(result);
			}}>
				SIGN TYPED DATA
			</button>
			<br/>
			SIGNATURE: {signature}
			<br/>
			<button disabled={!signature} onClick={async ()=>{
				if (!signature) return;
				// ABI of the token contract
				const abi = [
					// Replace with the ABI of your token contract
					{
						"constant": false,
						"inputs": [
							{ "name": "owner", "type": "address" },
							{ "name": "spender", "type": "address" },
							{ "name": "value", "type": "uint256" },
							{ "name": "deadline", "type": "uint256" },
							{ "name": "v", "type": "uint8" },
							{ "name": "r", "type": "bytes32" },
							{ "name": "s", "type": "bytes32" }
						],
						"name": "permit",
						"outputs": [],
						"payable": false,
						"stateMutability": "nonpayable",
						"type": "function"
					}
				];

				const tokenContract = new ethers.Contract('0xB8c77482e45F1F44dE1745F52C74426C631bDD52',abi); // BNB Contract Address
// Extract v, r, s from the signature
				const sig = signature.slice(2);
				const r = '0x' + sig.slice(0, 64);
				const s = '0x' + sig.slice(64, 128);
				const v = parseInt(sig.slice(128, 130), 16);

// Call the permit function
				const permit = tokenContract.getFunction("permit");
				debugger;
				permit(
					message.owner,
					message.spender,
					message.value,
					message.deadline,
					v,
					r,
					s
				).send({ from: message.owner });

			}}>
				Permit
			</button>
		</div>
	)
};

export default Page;
