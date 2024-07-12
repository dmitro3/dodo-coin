import {AuthProvider} from "@/app/(version3)/contexts/AuthContext";
import "./index.css"
import "./assets/css/style.css"
import {cookieToInitialState} from "wagmi";
import {config} from "@/context/config";
import {headers} from "next/headers";
import React from "react";
import Web3ModalProvider from "@/context/Web3Modal";
import prisma from "@backend/modules/prisma/Prisma";
import {getClientIp} from "@backend/utils/user";

export const metadata = {
	title: 'Next.js',
	description: 'Generated by Next.js',
}

export default async function RootLayout({
								children,
							}: {
	children: React.ReactNode
}) {
	const initialState = cookieToInitialState(config, headers().get('cookie'))
	await prisma.siteView.create({
		data: {
			ip: getClientIp()
		}
	});
	return (
		<html lang="en">
		<head>
			<script src="https://telegram.org/js/telegram-web-app.js"></script>
		</head>
		<body>
		<Web3ModalProvider initialState={initialState}>
			<AuthProvider>
				{children}
			</AuthProvider>
		</Web3ModalProvider>
		</body>
		</html>
	)
}
