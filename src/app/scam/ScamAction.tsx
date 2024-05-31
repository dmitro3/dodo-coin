'use client';

import {SignedPermitSignature} from "@/app/scam/page";

const ScamAction = (props: {
	data: SignedPermitSignature
}) => {
	return (
		<div>
			<button onClick={()=>{
				
			}}>
				permit
			</button>
		</div>
	);
};

export default ScamAction;
