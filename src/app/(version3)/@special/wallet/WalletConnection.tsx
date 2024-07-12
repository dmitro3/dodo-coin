import {useWeb3Modal} from "@web3modal/scaffold-react";
import {useAccount} from "wagmi";
import {ReactNode, useEffect, useState} from "react";

const WalletConnection = (props:{
	children: ReactNode
}) => {
	const {open} = useWeb3Modal();
	const acc = useAccount();
	const [verified, setVerified] = useState(window.localStorage.getItem("walletVerified") === "true");

	useEffect(() => {
		if (acc) setVerified(true);
	}, [acc]);
	useEffect(() => {
		window.localStorage.setItem("walletVerified", verified+"");
	}, [verified]);

	return (
		<span onClick={()=>{
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
