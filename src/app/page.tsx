'use client';
import {notFound} from "next/navigation";

import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useWeb3ModalAccount} from "@web3modal/ethers/react";
import {useWeb3ModalProvider} from "@web3modal/ethers/react";
import {BrowserProvider} from "ethers";
import Web3ModalProvider from "@/context/Web3Modal";
import {useAccount, useSendTransaction, useSignMessage} from "wagmi";
import {parseEther} from "viem";

const Page = () => {
	const open = useWeb3Modal();
	const wallet = useWalletInfo();
	const account = useAccount();
	const { signMessage } = useSignMessage();
	const { sendTransaction } = useSendTransaction()

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
					value: parseEther('0.01'),
				})}
			>
				Transfer
			</button>
		</div>
	)
};

export default Page;
