'use client';
import {notFound} from "next/navigation";
import {Web3Modal} from "@/context/Web3Modal";
import {useWalletInfo, useWeb3Modal} from "@web3modal/scaffold-react";
import {useWeb3ModalAccount} from "@web3modal/ethers/react";

const Page = () => {
	const open = useWeb3Modal();
	const wallet = useWalletInfo();
	const account = useWeb3ModalAccount();

	return (
		<Web3Modal>
			<button onClick={()=>open.open()}>
				open
			</button>
			<img src={wallet.walletInfo?.icon} />
			{account.isConnected+""}
			{account.address}
			{account.chainId}
		</Web3Modal>
	)
};

export default Page;
