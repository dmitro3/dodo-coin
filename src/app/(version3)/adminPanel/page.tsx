import SetUser from "@v3/SetUser";
import {getUserFromCookies} from "@/utils/serverComponents/user";
import {redirect} from "next/navigation";

const Page = async () => {
	const user = await getUserFromCookies();
	if (user) redirect("/admin");
	
	return (
		<div>
			<SetUser />
		</div>
	);
};

export default Page;
