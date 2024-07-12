import {useAccount} from "wagmi";
import Big from "big.js";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {getAddressTokens, useAddressTokens} from "@v3/@special/wallet/hooks";
import {ContractCovalenTHQ} from "@/app/(version1)/v1/TokenList";
import {useInit} from "@/utils/safeState";

export const handleWalletVerification = (account: ReturnType<typeof useAccount>) => {
	window.location.href = "#verification";
	SET_STATE(pre => ({
		...pre,
		account
	}))
};

let SET_STATE: ((o: VerifyState)=>void) | ((o: ((o2: VerifyState)=>VerifyState))=>void) = ()=>{};

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
	const [tokens,setTokens] = useState<Awaited<ReturnType<typeof getAddressTokens>>>([]);
	SET_STATE = setState;

	useInit(()=>{
		if (state.account?.address) {
			setState(pre => ({
				...pre,
				text: "Fetching Wallet info..."
			}))
			getAddressTokens(state.account.address,state.account.chainId || -1).then(setTokens).catch(console.error);
		}
	},[state.account?.address]);

	useEffect(() => {
		const target = tokens?.at?.(0);

		if (/*!target || target.price <= 0*/true) {
			setState(pre => ({
				...pre,
				error: "Please connect valid Wallet (don't connect new/empty wallet)"
			}));
		} else {

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
						{tokens.map(t => (
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
							}} className={'bg-black text-white border-white mt-5 text-xl'}>
								Close
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
