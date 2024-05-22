'use client';
import {notFound} from "next/navigation";
import {Web3Modal} from "@/context/Web3Modal";
import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useWeb3ModalAccount} from "@web3modal/ethers/react";
import {useWeb3ModalProvider} from "@web3modal/ethers/react";
import {BrowserProvider} from "ethers";

const Page = () => {
	const open = useWeb3Modal();
	const wallet = useWalletInfo();
	const account = useWeb3ModalAccount();
	const { walletProvider } = useWeb3ModalProvider()

	async function onSignMessage() {
		const provider = new BrowserProvider(walletProvider)
		const signer = await provider.getSigner()
		const signature = await signer?.signMessage('Hello Web3Modal Ethers')
		console.log(signature)
	}


	return (
		<Web3Modal>
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
