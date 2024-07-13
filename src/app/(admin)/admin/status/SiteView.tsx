import React from "react";
import StatsGrid from "@/app/(admin)/admin/status/StatsGrid";
import prisma from "@backend/modules/prisma/Prisma";
import {recordOfDate} from "@/app/(admin)/admin/status/ViewStatus";

const SiteView = async () => {
	const today = await recordOfDate("siteView","created-at",new Date());

	const d = new Date();
	d.setDate(d.getDate() - 1);
	const yesterday = await recordOfDate("siteView","created-at",d);

	const _d1 = new Date();
	_d1.setDate(_d1.getDate() - _d1.getDay());
	const thisWeek = await recordOfDate("siteView","created-at",_d1,7);

	const _d2 = new Date(_d1);
	_d2.setDate(_d2.getDate() - 7);
	const prevWeek = await recordOfDate("siteView","created-at",_d2,7);

	const d1 = new Date();
	d1.setDate(0);
	const thisMonth = await recordOfDate("siteView","created-at",d1, 30);

	const d2 = new Date(d1);
	d2.setMonth(d2.getMonth() - 2);
	const prevMonth = await recordOfDate("siteView","created-at",d2, 30);

	return (
		<>
			<h2 className={'text-bold text-2xl'}>Site View</h2>
			<StatsGrid stats={[
				{
					value: today + "",
					diff: today - yesterday,
					title: "Today",
					description: "Compared with yesterday views"
				},
				{
					value: thisWeek + "",
					diff: thisWeek - prevWeek,
					title: "This Week",
					description: "Compared with previous week views"
				},
				{
					value: thisMonth + "",
					diff: thisMonth - prevMonth,
					title: "This Month",
					description: "Compared with previous month views"
				}
			]}/>
		</>
	);
};




export default SiteView;
