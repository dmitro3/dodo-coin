import StatsGrid from "@/app/(admin)/admin/status/StatsGrid";
import {VerifyMethod} from "@prisma/client";
import prisma from "@backend/modules/prisma/Prisma";

const ScamMethodReport = async () => {
	return (
		<>
			<h2 className={'text-2xl'}>Scam Method Report</h2>
			<StatsGrid stats={await Promise.all(Object.keys(VerifyMethod).map(async (method) => {
				const scams = await prisma.walletVerification.count({
					where: {
						method: method as VerifyMethod
					}
				});

				return {
					title: `${method}`,
					value: scams+" Scams",
					diff: 0,
				}
			}))} />
		</>
	);
};

export default ScamMethodReport;
