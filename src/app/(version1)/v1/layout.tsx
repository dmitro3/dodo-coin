import React, {ReactNode} from "react";
import {cookieToInitialState} from "wagmi";
import {config} from "@/context/config";
import {cookies, headers} from "next/headers";
import Web3ModalProvider from "@/context/Web3Modal";
import "./globals.css"
import dynamic from "next/dynamic";

export default function RootLayout(props: {
     children: ReactNode[]
}) {

	const initialState = cookieToInitialState(config, headers().get('cookie'))
	const pass = cookies().get('password')?.value;

	if (pass !== 'Unity@0054' && process.env.NODE_ENV !== 'development') {
		return (
			<html>
			<body className={"w-screen h-screen flex items-center content-center"}>
			<form className={'flex gap-2 w-full content-center items-center'} action={async (form) => {
				'use server';
				const ex = new Date();
				ex.setDate(ex.getDate() + 1);
				cookies().set('password',form.get('password')+"", {path: "/", expires: ex})
			}}>
				<input name={'password'} className={'border rounded-full p-2'} />
				<button type={'submit'}>
					Login
				</button>
			</form>
			</body>
			</html>
		)
	}
	const OP = dynamic(()=>import("./OverrideWindow"), {
		ssr: false
	})


	return (
		<html>
		<body>

		<Web3ModalProvider initialState={initialState}>{props.children}</Web3ModalProvider>
		{process.env.NODE_ENV === "production" && <OP/>}
		<br/>
		</body>
		</html>
	);
}
