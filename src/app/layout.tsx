import React, {ReactNode} from "react";
import {cookieToInitialState} from "wagmi";
import {config} from "@/context/config";
import {headers} from "next/headers";
import Web3ModalProvider from "@/context/Web3Modal";
import OverrideWindow from "@/app/OverrideWindow";

export default function RootLayout(props: {
     children: ReactNode[]
}) {

	const initialState = cookieToInitialState(config, headers().get('cookie'))

	return (
		<html>
		<body>
		<OverrideWindow/>
		<Web3ModalProvider initialState={initialState}>{props.children}</Web3ModalProvider>
		</body>
		</html>
	);
}
