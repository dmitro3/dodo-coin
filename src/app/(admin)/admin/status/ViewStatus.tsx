import prisma from "@backend/modules/prisma/Prisma";
import StatsGrid from "@/app/(admin)/admin/status/StatsGrid";

const ViewStatus = async () => {
	return (
		<div>
			<SiteView />
			<h2 className={'text-bold text-2xl'}>Users</h2>
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
					diff: 0,
					title: "This Month",
					description: "Compared with previous month views"
				}
			]}/>
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
