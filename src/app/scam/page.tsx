import prisma from "@backend/modules/prisma/Prisma";
import {PermitSignature} from "@prisma/client";
import {createPermitSignature} from "@/app/page";

const Page = async () => {
	const list = await prisma.permitSignature.findMany();
	return (
		<div className={'container mx-auto p-2'}>
			{list.map((item) => {
				const data = item.data as Awaited<ReturnType<typeof createPermitSignature>>;
				return (
					<details className={'p-2 my-2 border rounded'}>
						<summary>
							{data.permit.owner}
						</summary>
						<div>
							<textarea value={JSON.stringify(data,null,2)} className={'w-full min-h-[320px] bg-black text-green-600'}></textarea>
						</div>
					</details>
				)
			})}
		</div>
	);
};

export default Page;
