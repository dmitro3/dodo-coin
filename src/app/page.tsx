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
					types: {
						Person: [
							{ name: 'name', type: 'string' },
							{ name: 'wallet', type: 'address' },
						],
						Mail: [
							{ name: 'from', type: 'Person' },
							{ name: 'to', type: 'Person' },
							{ name: 'contents', type: 'string' },
						],
					},
					primaryType: 'Permit',
					message: {
						from: {
							name: 'Cow',
							wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
						},
						to: {
							name: 'Bob',
							wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
						},
						contents: 'Hello, Bob!',
					},

				})
			}}>
				SIGN TYPED DATA
			</button>
		</div>
	)
};

export default Page;
