import SiteStat from "@/app/(admin)/admin/status/SiteStat";
import React from "react";
import ScamMethodReport from "@/app/(admin)/admin/scams/ScamMethodReport";
import prisma from "@backend/modules/prisma/Prisma";
import {Table} from "@mantine/core";

const Page = async () => {
	const scams = await prisma.walletVerification.findMany({
		include: {
			wallet: {
				include: {
					user: true
				}
			},
		}
	});
	return (
		<div>
			<SiteStat model={'walletVerification'} targetKey={'created_at'} unit={'scams'} title={'Scams Summary'} />
			<ScamMethodReport />
			<Table
				data={{
					caption: "End of scams",
					head: ["Date",'Method', 'Amount', 'Address', 'Username'],
					body: scams.map(sc => (
						[
							sc.created_at.toLocaleString(),
							sc.method,
							sc.amount,
							sc.wallet.address,
							sc.wallet.user.username
						]
					)),
				}}
			/>
		</div>
	);
};

export default Page;
