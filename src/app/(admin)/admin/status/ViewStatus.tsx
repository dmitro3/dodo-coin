import prisma from "@backend/modules/prisma/Prisma";

const ViewStatus = async () => {

	const today = await viewOfDate(new Date());

	const d = new Date();
	d.setDate(d.getDate() - 1);
	const yesterday = await viewOfDate(d);

	const thisMonth = await viewOfDate(new Date(), 30);

	const d2 = new Date();
	d2.setMonth(d2.getMonth() - 1);
	const prevMonth = await viewOfDate(d2, 30);

	return (
		<div>

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
