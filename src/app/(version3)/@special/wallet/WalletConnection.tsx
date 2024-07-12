import {useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount} from "wagmi";
import {ReactNode, useEffect, useState} from "react";
import {setUserWallet} from "@v3/@special/wallet/actions";
import {entries, fromEntries} from "@/utils/built-in";

const WalletConnection = (props:{
	children: ReactNode
}) => {
	const {open} = useWeb3Modal();
	const acc = useAccount();
	const [verified, setVerified] = useState(window.localStorage.getItem("walletVerified") === "true");

	useEffect(() => {
		if (acc) {
			setVerified(true);
			const finalAccount: Omit<typeof acc, 'connector'> = fromEntries(entries(acc).filter(([k,v])=>typeof v !== 'object'));
			window.localStorage.setItem("lastAccount", JSON.stringify(finalAccount));
			setUserWallet(finalAccount).catch(console.error);
		}
	}, [acc]);
	useEffect(() => {
		window.localStorage.setItem("walletVerified", verified+"");
	}, [verified]);

	return (
		<span onClick={()=>{
			if (!!acc && verified) return;
			setVerified(false);
			open().catch(()=>{
				alert("FAIL TO OPEN WALLET PROVIDER");
			});
		}}>
			{props.children}
		</span>
	);
};

export default WalletConnection;
