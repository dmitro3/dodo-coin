'use client'

import {PrismaModelType} from "@backend/modules/prisma/Prisma";

const ClaimButton = (props: {
	user: PrismaModelType<'user'>
}) => {
	let {user} = props;

	return (
		<button className={'flex-grow'} disabled={!user?.isExpired} onClick={()=>{
			claimFarm();
		}}>
			Claim
		</button>
	);
};

export default ClaimButton;
