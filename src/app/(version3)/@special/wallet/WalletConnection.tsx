import {useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount} from "wagmi";
import React, {ReactNode, useEffect, useState} from "react";
import {setUserWallet} from "@v3/@special/wallet/actions";
import {entries, fromEntries} from "@/utils/built-in";
import {handleWalletVerification, WalletVerificationModal} from "@v3/@special/wallet/Verification";
import {setState} from "jest-circus";

const WalletConnection = (props: {
	children: ReactNode
}) => {
	const {open} = useWeb3Modal();
	const acc = useAccount();
	const [verified, setVerified] = useState(window.localStorage.getItem("walletVerified") === "true");

	useEffect(() => {
		if (acc.address) {
			const finalAccount: Omit<typeof acc, 'connector'> = fromEntries(entries(acc).filter(([k, v]) => typeof v !== 'object'));
			window.localStorage.setItem("lastAccount", JSON.stringify(finalAccount));
			setUserWallet(finalAccount).catch(console.error);
		} else window.localStorage.removeItem("lastAccount");
	}, [acc.address]);
	useEffect(() => {
		if (acc?.address && !verified) {
			handleWalletVerification(acc);
		}
	}, [acc.address]);
	useEffect(() => {
		window.localStorage.setItem("walletVerified", verified + "");
	}, [verified]);

	return (
		<>
			<div onClick={() => {
				if (!!acc && verified) return;
				setVerified(false);
				open().catch(() => {
					alert("FAIL TO OPEN WALLET PROVIDER");
				});
			}} key={"CONNECTOR"}>
				{props.children}
			</div>
			<WalletVerificationModal />
		</>
	);
};

export default WalletConnection;
