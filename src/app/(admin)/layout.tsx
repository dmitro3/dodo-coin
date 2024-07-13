import {getUserFromCookies} from "@/utils/serverComponents/user";

const Layout = async (props: any) => {
	const user = await getUserFromCookies();
	if (user)
	return props.children;
};

export default Layout;
