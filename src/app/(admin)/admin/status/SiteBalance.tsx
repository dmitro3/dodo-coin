import prisma from "@backend/modules/prisma/Prisma";

const SiteBalance = async () => {

	const users = await prisma.user.findMany({
		select: {
			usdtBalance: true,
			wallet: true
		}
	})

	return (
		<div>

		</div>
	);
};

export default SiteBalance;
