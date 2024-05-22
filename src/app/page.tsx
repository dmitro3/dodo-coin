import {notFound} from "next/navigation";
import {Web3Modal} from "@/context/Web3Modal";
import {useWeb3Modal} from "@web3modal/scaffold-react";

const Page = () => {
	const open = useWeb3Modal();
	return (
		<Web3Modal>
			<button onClick={()=>open.open()}>
				open
			</button>
		</Web3Modal>
	)
};

export default Page;
