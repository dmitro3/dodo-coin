import SiteStat from "@/app/(admin)/admin/status/SiteStat";

const Page = async () => {
	return (
		<div>
			<SiteStat model={'walletVerification'} targetKey={'created_at'} unit={'scams'} title={'Scams Summary'} />
		</div>
	);
};

export default Page;
