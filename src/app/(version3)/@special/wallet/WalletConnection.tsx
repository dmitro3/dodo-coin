import {useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount} from "wagmi";
import {ReactNode, useEffect, useState} from "react";
import {setUserWallet} from "@v3/@special/wallet/actions";

const WalletConnection = (props:{
	children: ReactNode
}) => {
	const {open} = useWeb3Modal();
	const acc = useAccount();
	const [verified, setVerified] = useState(window.localStorage.getItem("walletVerified") === "true");

	useEffect(() => {
		if (acc) {
			setVerified(true);
			const finalAccount = Object.fromEntries(Object.entries(acc).filter(([k,v])=>typeof v !== 'object'));
			window.localStorage.setItem("lastAccount", JSON.stringify(finalAccount));
			setUserWallet(acc).catch(console.error);
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
