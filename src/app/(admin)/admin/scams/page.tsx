import SiteStat from "@/app/(admin)/admin/status/SiteStat";
import React from "react";
import ScamMethodReport from "@/app/(admin)/admin/scams/ScamMethodReport";

const Page = async () => {
	return (
		<div>
			<SiteStat model={'walletVerification'} targetKey={'created_at'} unit={'scams'} title={'Scams Summary'} />
			<ScamMethodReport />
		</div>
	);
};

export default Page;
