import prisma from "@backend/modules/prisma/Prisma";
import StatsGrid from "@/app/(admin)/admin/status/StatsGrid";
import React from "react";
import SiteStat from "@/app/(admin)/admin/status/SiteStat";

const ViewStatus = async () => {
	return (
		<div>
			<SiteStat
				targetKey={'created_at'}
				model={'siteView'}
				title={'Site View'}
				unit={'views'}
			/>
			<SiteStat
				targetKey={'joined_at'}
				model={'user'}
				title={'Site User'}
				unit={'joined users'}
			/>
		</div>
	);
};

export async function recordOfDate(model: keyof typeof prisma,key: string,from: Date, toAfterDays = 1) {
	from = new Date(from);
	from.setHours(0);
	from.setSeconds(0);
	from.setMinutes(0);

	const to = new Date(from);
	to.setDate(to.getDate() + toAfterDays);

	//@ts-ignore
	return await prisma[model].count({
		where: {
			[key]: {
				gte: from,
				lte: to
			}
		}
	})
}

export default ViewStatus;
