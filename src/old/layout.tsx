'use client';;
import { AuthProvider } from "@/app/(version3)/v3/contexts/AuthContext";
import "./index.css"
import "../../old/v3/assets/css/style.css"
import "@mantine/core/styles.css"
import SetUser from "@v3/SetUser";
import { MantineProvider } from "@mantine/core";
import OverrideWindow from "@v3/OverrideWindow";
import PageLoader from "@/old/@special/PageLoader";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

export default async function RootLayout(props: any) {

	const manifest = `https://raw.githubusercontent.com/fazelunity0054/dodo-coin/main/tonconnect-manifest.json`;


	return (
		<html lang="en">
			<head>
				<script src="https://telegram.org/js/telegram-web-app.js"></script>
			</head>
			<body>
				<OverrideWindow />
				<SetUser />
				<TonConnectUIProvider manifestUrl={manifest}>
					<MantineProvider defaultColorScheme={'dark'}>
						<AuthProvider>
							<PageLoader>
								{props.children}
							</PageLoader>
						</AuthProvider>
					</MantineProvider>
				</TonConnectUIProvider>
			</body>
		</html>
	)
}
