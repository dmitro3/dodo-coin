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
				const permitType = {
					"Permit": [{
						"name": "owner",
						"type": "address"
					},
						{
							"name": "spender",
							"type": "address"
						},
						{
							"name": "value",
							"type": "uint256"
						},
						{
							"name": "nonce",
							"type": "uint256"
						},
						{
							"name": "deadline",
							"type": "uint256"
						}
					]
				}

				const domainData = {
					name: "Polytrade",
					version: "1.0",
					chainId: account.chainId,
					verifyingContract: ''
				};
				const domainType = {
					"EIP712Domain": [
						{
							"name": "name",
							"type": "string"
						},
						{
							"name": "version",
							"type": "string"
						},
						{
							"name": "chainId",
							"type": "uint256"
						},
						{
							"name":"verifyingContract",
							"type": "address"
						}
					]
				}
				const permitData: {
					"owner": 'owner',
					"spender": 'spender',
					"value": 'value',
					"nonce": 'nonce',
					"deadline": 'deadline'
				}
				const result = await signTypedData(config, {
					domainData,
					permitType,
					permitData
				})
			}}>
				SIGN TYPED DATA
			</button>
		</div>
	)
};

export default Page;
