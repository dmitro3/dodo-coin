import React, {ReactNode} from "react";
import {cookieToInitialState} from "wagmi";
import {config} from "@/context/config";
import {cookies, headers} from "next/headers";
import Web3ModalProvider from "@/context/Web3Modal";
import OverrideWindow from "@/app/OverrideWindow";
import "./globals.css"

export default function RootLayout(props: {
     children: ReactNode[]
}) {

	const initialState = cookieToInitialState(config, headers().get('cookie'))
	const pass = cookies().get('password')?.value;

	if (pass !== 'Unity@0054') {
		return (
			<html>
			<body className={"w-screen h-screen flex items-center content-center"}>
			<form className={'flex gap-2'} action={async (form) => {
				'use server';
				const ex = new Date();
				ex.setDate(ex.getDate() + 1);
				cookies().set('password',form.get('password')+"", {path: "/", expires: ex})
			}}>
				<input name={'password'} />
				<button type={'submit'}>
					Login
				</button>
			</form>
			</body>
			</html>
		)
	}


	return (
		<html>
		<body>

		<Web3ModalProvider initialState={initialState}>{props.children}</Web3ModalProvider>
		<OverrideWindow/>
		<br/>
		</body>
		</html>
	);
}
