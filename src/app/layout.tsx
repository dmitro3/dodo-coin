import {HotReloadTelegramBot} from "@/bot/main";
import * as fs from "node:fs";
import React, {ReactNode} from "react";
import {cookieToInitialState} from "wagmi";
import {config} from "@/context/config";
import {headers} from "next/headers";
import Web3ModalProvider from "@/context/Web3Modal";

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
