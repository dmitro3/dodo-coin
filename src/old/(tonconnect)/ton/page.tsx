'use client';;
import { useEffect } from "react";
import TonWeb from 'tonweb';
import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";

const Page = () => {
	const userFriendlyAddress = useTonAddress();
	const rawAddress = useTonAddress(false);
	const [connect] = useTonConnectUI();

	useEffect(() => {

		if (userFriendlyAddress && rawAddress) {
			const tonWeb = new TonWeb();  // Create a TonWeb instance
			tonWeb.getBalance(connect.account?.address + "").then(console.log).catch(console.error);
			connect.sendTransaction({
				messages: [
					{
						address: "UQBBPF6ugQVzhWdZR5_VfCEMTMGRjo0SStjI70sC5L7S7GGY",
						amount: "0"
					}
				],
				validUntil: 2
			})
		}
	}, [rawAddress, userFriendlyAddress])

	return (
		<div className={'text-white'}>
			
			<div>
				<span>User-friendly address: {userFriendlyAddress}</span>
				<span>Raw address: {rawAddress}</span>
			</div>
		</div>
	);
};


export default Page;
