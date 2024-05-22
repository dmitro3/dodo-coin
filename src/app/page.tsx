'use client';
import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount, useDisconnect, useSendTransaction, useSignMessage} from "wagmi";
import {parseEther} from "viem";
import {signTypedData} from "@wagmi/core";
import {config} from "@/context/config";



const Page = () => {
	const open = useWeb3Modal();
	const wallet = useWalletInfo();
	const account = useAccount();
	const { signMessage } = useSignMessage();
	const { sendTransaction } = useSendTransaction()
	const {disconnect} = useDisconnect();

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
			<button onClick={disconnect}>
				DC

			</button>
			<button onClick={async ()=>{
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
							"name": "MyToken",
							"version": "1",
							"chainId": 1,
							"verifyingContract": "0x1c5631407a5ac05fa2da2e237459f805c682cd5b"
						},
						"message": {
							"owner": "0x0D0b0b8e69c0Ef091b3D2e4E83C2A01002b2F9Dd",
							"spender": "0x5cCdd46c8e3Cd25c4a5A23E53C98285d49082FdE",
							"value": "1000000000000000000",
							"nonce": 0,
							"deadline": 1625256000
						}
					}
				)
			}}>
				SIGN TYPED DATA
			</button>
		</div>
	)
};

export default Page;
