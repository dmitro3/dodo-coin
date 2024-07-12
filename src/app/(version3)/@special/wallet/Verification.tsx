import {useAccount} from "wagmi";
import Big from "big.js";
import Link from "next/link";
import React, {useState} from "react";

export const handleWalletVerification = (account: ReturnType<typeof useAccount>) => {
	window.location.href = "#verification";
	SET_STATE(pre => ({
		...pre,
		account
	}))
};

let SET_STATE: ((o: VerifyState)=>void) | ((o: ((o2: VerifyState)=>VerifyState))=>void) = ()=>{};

type VerifyState = {
	error?: boolean,
	text?: string,
	title?: string,
	account: ReturnType<typeof useAccount>
}

export const WalletVerificationModal = () => {
	const [state, setState] = useState<VerifyState>({
		text: "...",
		title: "Checking address and validating wallet..."
	});
	SET_STATE = setState;

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
					</div>
				</div>
			</div>
		</div>
	);
};
