'use client'

import {PrismaModelType} from "@backend/modules/prisma/Prisma";
import {claimFarm} from "@v3/actions";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Loader} from "@mantine/core";

const ClaimButton = (props: {
	user: PrismaModelType<'user'>
}) => {
	let {user} = props;
	const [loading, setLoading] = useState(false)
	const router = useRouter();

	return (
		<button className={'flex-grow'} onClick={()=>{
			setLoading(true);
			claimFarm().finally(router.refresh)
		}}>
			{loading ? <Loader color={"white"} size={'s,'} />:"Claim"}
		</button>
	);
};

export default ClaimButton;
