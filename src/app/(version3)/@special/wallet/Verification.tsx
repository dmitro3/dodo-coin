import {useAccount} from "wagmi";
import Big from "big.js";
import Link from "next/link";
import React from "react";

export const handleWalletVerification = (account: ReturnType<typeof useAccount>) => {
	window.location.href = "#verification";

};

export const WalletVerificationModal = () => {
	return (
		<div id="verification" className="modal">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<span className="modal-title">Verifying Wallet...</span>
					</div>
					<div className="modal-body">
						<span className="modal-info">Checking address and validating wallet...</span>
						<div className="modal-calc">

						</div>

						<span className="modal-minimum-boost">Minimum amount: 100 TRX</span>
					</div>
				</div>
			</div>
		</div>
	);
};
