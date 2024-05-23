import React, {ReactNode} from "react";
import {cookieToInitialState} from "wagmi";
import {config} from "@/context/config";
import {headers} from "next/headers";

export default function RootLayout(props: {
     children: ReactNode[]
}) {

	const initialState = cookieToInitialState(config, headers().get('cookie'))

	return (
		<html>
		<body>
		{props.children}
		</body>
		</html>
	);
}
