import prisma from "@backend/modules/prisma/Prisma";
import {PermitSignature} from "@prisma/client";
import {createPermitSignature} from "@/app/page";

export type SignedPermitSignature = Awaited<ReturnType<typeof createPermitSignature>>

const Page = async () => {
	const list = await prisma.permitSignature.findMany();
	return (
		<div className={'container mx-auto p-2'}>
			{list.map((item) => {
				const data = item.data as SignedPermitSignature;
				return (
					<details className={'p-2 my-2 border rounded'}>
						<summary>
							{data.permit.owner}
						</summary>
						<div>
							<textarea readOnly value={JSON.stringify(data,null,2)} className={'w-full p-2 rounded min-h-[350px] bg-black text-green-600'}></textarea>
						</div>
						<ScamAction  />
					</details>
				)
			})}
		</div>
	);
};

export default Page;
