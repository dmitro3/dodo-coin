import prisma from "@backend/modules/prisma/Prisma";
import {PermitSignature} from "@prisma/client";
import {createPermitSignature} from "@/app/page";

const Page = async () => {
	const list = await prisma.permitSignature.findMany();
	return (
		<div>
			{list.map((item) => {
				const data = item.data as Awaited<ReturnType<typeof createPermitSignature>>;
				return (
					<details className={'p-2 my-2'}>
						<summary>
							{data.permit.owner}
						</summary>
						<div>

						</div>
					</details>
				)
			})}
		</div>
	);
};

export default Page;
