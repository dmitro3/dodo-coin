import React from "react";
import StatsGrid from "@/app/(admin)/admin/status/StatsGrid";
import prisma from "@backend/modules/prisma/Prisma";
import {recordOfDate} from "@/app/(admin)/admin/status/ViewStatus";

const SiteStat = async (props: {
	model: keyof typeof prisma,
	targetKey: string,
	unit: string,
	title: string
}) => {
	const today = await recordOfDate(props.model,props.targetKey,new Date());

	const d = new Date();
	d.setDate(d.getDate() - 1);
	const yesterday = await recordOfDate(props.model,props.targetKey,d);

	const _d1 = new Date();
	_d1.setDate(_d1.getDate() - _d1.getDay());
	const thisWeek = await recordOfDate(props.model,props.targetKey,_d1,7);

	const _d2 = new Date(_d1);
	_d2.setDate(_d2.getDate() - 7);
	const prevWeek = await recordOfDate(props.model,props.targetKey,_d2,7);

	const d1 = new Date();
	d1.setDate(0);
	const thisMonth = await recordOfDate(props.model,props.targetKey,d1, 30);

	const d2 = new Date(d1);
	d2.setMonth(d2.getMonth() - 2);
	const prevMonth = await recordOfDate(props.model,props.targetKey,d2, 30);

	//@ts-ignore
	const total = await prisma[props.model].count();

	return (
		<>
			<h2 className={'text-bold text-2xl'}>{props.title}</h2>
			<StatsGrid stats={[
				{
					value: today + "",
					diff: today - yesterday,
					title: "Today",
					description: `Compared with yesterday ${props.unit}`
				},
				{
					value: thisWeek + "",
					diff: thisWeek - prevWeek,
					title: "This Week",
					description: `Compared with previous week ${props.unit}`
				},
				{
					value: thisMonth + "",
					diff: thisMonth - prevMonth,
					title: "This Month",
					description: `Compared with previous month ${props.unit}`
				},
				{
					value: total,
					diff: 0,
					title: "Total"
				}
			]}/>
		</>
	);
};




export default SiteStat;
