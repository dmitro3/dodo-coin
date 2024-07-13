'use client'

import {PrismaModelType} from "@backend/modules/prisma/Prisma";
import {claimFarm} from "@v3/actions";
import {useRouter} from "next/navigation";

const ClaimButton = (props: {
	user: PrismaModelType<'user'>
}) => {
	let {user} = props;
	const router = useRouter();

	return (
		<button className={'flex-grow'} disabled={!user?.isExpired} onClick={()=>{
			claimFarm().then(router.refresh)
		}}>
			Claim
		</button>
	);
};

export default ClaimButton;
