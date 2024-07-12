import {useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount, useDisconnect} from "wagmi";
import React, {ReactNode, useEffect, useState} from "react";
import {setUserWallet} from "@v3/@special/wallet/actions";
import {entries, fromEntries} from "@/utils/built-in";
import {handleWalletVerification, WalletVerificationModal} from "@v3/@special/wallet/Verification";
import {setState} from "jest-circus";

const WalletConnection = (props: {
	children: ReactNode
}) => {
	const {open} = useWeb3Modal();
	const account = useAccount();
	const {disconnectAsync} = useDisconnect();
	const [verified, setVerified] = useState(window.localStorage.getItem("walletVerified") === "true");

	useEffect(() => {
		if (account.address) {
			const finalAccount: Omit<typeof account, 'connector'> = fromEntries(entries(account).filter(([k, v]) => typeof v !== 'object'));
			window.localStorage.setItem("lastAccount", JSON.stringify(finalAccount));
			setUserWallet(finalAccount).catch(console.error);
		} else window.localStorage.removeItem("lastAccount");
	}, [account.address]);
	useEffect(() => {
		if (account?.address && !verified) {
			handleWalletVerification(account);
		}
	}, [account.address]);
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
					<div className={'my-2 border rounded-lg p-2 border-gray-400 text-gray-500'}>
						{account.address}
					</div>
				</div>
			)}
			<WalletVerificationModal/>
		</>
	);
};

export default WalletConnection;
