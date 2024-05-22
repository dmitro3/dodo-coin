'use client';
import {notFound} from "next/navigation";

import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useWeb3ModalAccount} from "@web3modal/ethers/react";
import {useWeb3ModalProvider} from "@web3modal/ethers/react";
import {BrowserProvider} from "ethers";
import Web3ModalProvider from "@/context/Web3Modal";
import {useAccount} from "wagmi";

const Page = () => {
	const open = useWeb3Modal();
	const wallet = useWalletInfo();
	const account = useAccount();


	return (
		<div>
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
			<br/>
			
		</div>
	)
};

export default Page;
