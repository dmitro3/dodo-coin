import {useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount, useDisconnect} from "wagmi";
import React, {ReactNode, useEffect, useState} from "react";
import {setUserWallet} from "@/old/@special/wallet/actions";
import {entries, fromEntries} from "@/utils/built-in";
import {useInit} from "@/utils/safeState";

const WalletConnection = (props: {
	children: ReactNode
}) => {
	const {open} = useWeb3Modal();
	const account = useAccount();
	const {disconnectAsync} = useDisconnect();


	const [verified, setVerified] = useState(false);

	useInit(()=>{
		setVerified(window.localStorage.getItem("walletVerified") === "true")
	})

	useEffect(() => {
		if (account.address) {
			const finalAccount: Omit<typeof account, 'connector'> = fromEntries(entries(account).filter(([k, v]) => typeof v !== 'object' || Array.isArray(v)));
			window.localStorage.setItem("lastAccount", JSON.stringify(finalAccount));
			setUserWallet(JSON.parse(JSON.stringify(finalAccount))).catch(console.error);
		} else window.localStorage.removeItem("lastAccount");
	}, [account.address,account.addresses]);

	useEffect(() => {
		window.localStorage.setItem("walletVerified", verified + "");
	}, [verified]);

	return (
		<>
			{!account.address ? (
				<div onClick={() => {
					disconnectAsync();
					if (!!account.address && verified) return;
					setVerified(false);
					open().catch(() => {
						alert("FAIL TO OPEN WALLET PROVIDER");
					});
				}} key={"CONNECTOR"}>
					{props.children}
				</div>
			):(
				<div>
					<p>Connected</p>
					<div className="flex justify-center items-center gap-3">
						<div className={'my-2 border rounded-lg p-2 border-gray-400 text-gray-400 break-words text-wrap'}>
							{account.address.slice(0,10)}...{account.address.slice(-10)}
						</div>
						<button onClick={()=>{
							disconnectAsync();
						}} >
							<svg xmlns="http://www.w3.org/2000/svg" width={20} height={24} viewBox="0 0 24 24"
								fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
								strokeLinejoin="round"
								className="icon icon-tabler icons-tabler-outline icon-tabler-x">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
								<path d="M18 6l-12 12"/>
								<path d="M6 6l12 12"/>
							</svg>
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default WalletConnection;
