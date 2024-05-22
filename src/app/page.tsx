'use client';
import {notFound} from "next/navigation";

import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useWeb3ModalAccount} from "@web3modal/ethers/react";
import {useWeb3ModalProvider} from "@web3modal/ethers/react";
import {BrowserProvider} from "ethers";
import Web3ModalProvider from "@/context/Web3Modal";

const Page = () => {
	const open = useWeb3Modal();
	const wallet = useWalletInfo();
	const account = useWeb3ModalAccount();
	const { walletProvider } = useWeb3ModalProvider()

	async function onSignMessage() {
		const provider = new BrowserProvider(walletProvider)
		const signer = await provider.getSigner()

		console.log(await signer.sendTransaction({
			from: account.address,
			chainId: account.chainId,
			value: 10,
			gasPrice: 10
		}))
	}


	return (
		<Web3ModalProvider>
			<button onClick={()=>open.open()}>
				open
			</button>
			<img src={wallet.walletInfo?.icon} />
			<br/>
			<button onClick={() => onSignMessage()}>Sign Message</button>
			<br/>
			{account.isConnected+""}
			<br/>
			{account.address}
			<br/>
			{account.chainId}
		</Web3Modal>
	)
};

export default Page;
