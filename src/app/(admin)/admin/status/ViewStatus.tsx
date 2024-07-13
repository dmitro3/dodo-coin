import prisma from "@backend/modules/prisma/Prisma";
import StatsGrid from "@/app/(admin)/admin/status/StatsGrid";

const ViewStatus = async () => {

	const today = await viewOfDate(new Date());

	const d = new Date();
	d.setDate(d.getDate() - 1);
	const yesterday = await viewOfDate(d);

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
