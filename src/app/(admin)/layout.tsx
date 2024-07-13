import {getUserFromCookies} from "@/utils/serverComponents/user";
import {DodoAdmins} from "@/bot/classes/DodoAdmin";
import {redirect} from "next/navigation";
import "../globals.css";
import React from "react";
import {MantineProvider} from "@mantine/core";
const Layout = async (props: any) => {
	const user = await getUserFromCookies();
	if (!user || !DodoAdmins.includes(user.id)) redirect("/#deny")
	return (
		<html>
		<body>
		<MantineProvider>
		{props.children}
		</MantineProvider>
		</body>
		</html>
	);
};

export default Layout;
