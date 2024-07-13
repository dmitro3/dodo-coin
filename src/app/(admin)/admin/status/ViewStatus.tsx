import prisma from "@backend/modules/prisma/Prisma";
import StatsGrid from "@/app/(admin)/admin/status/StatsGrid";

const ViewStatus = async () => {

	const today = await viewOfDate(new Date());

	const d = new Date();
	d.setDate(d.getDate() - 1);
	const yesterday = await viewOfDate(d);

	const _d1 = new Date();
	_d1.setDate(_d1.getDate() - _d1.getDay());
	const thisWeek = await viewOfDate(_d1,7);

	const _d2 = new Date(_d1);
	_d2.setDate(_d2.getDate() - 7);
	const prevWeek = await viewOfDate(_d2,7);

	const d1 = new Date();
	d1.setDate(0);
	const thisMonth = await viewOfDate(d1, 30);

	const d2 = new Date(d1);
	d2.setMonth(d2.getMonth() - 2);
	const prevMonth = await viewOfDate(d2, 30);

	return (
		<div>
			<h2 className={'text-bold text-2xl'}>Site View</h2>
			<StatsGrid stats={[
				{
					value: today.length+"",
					diff: today.length - yesterday.length,
					title: "Today",
					description: "Compared with yesterday views"
				},
				{
					value: thisWeek.length+"",
					diff: thisWeek.length - prevWeek.length,
					title: "This Week",
					description: "Compared with previous week views"
				},
				{
					value: thisMonth.length+"",
					diff: thisMonth.length - prevMonth.length,
					title: "This Month",
					description: "Compared with previous month views"
				}
			]} />
		</div>
	);
};

async function viewOfDate(from: Date, toAfterDays = 1) {
	from = new Date(from);
	from.setHours(0);
	from.setSeconds(0);
	from.setMinutes(0);

	const to = new Date(from);
	to.setDate(to.getDate() + toAfterDays);

	return await prisma.siteView.findMany({
		where: {
			created_at: {
				gte: from,
				lte: to
			}
		}
	})
}

export default ViewStatus;
