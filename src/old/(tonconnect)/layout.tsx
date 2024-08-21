'use client';

import React from "react";
import {TonConnectUIProvider} from '@tonconnect/ui-react';

const Layout = (props: any) => {
	const manifest = `https://raw.githubusercontent.com/fazelunity0054/dodo-coin/main/tonconnect-manifest.json`;
	
	return (
		<html>
		<body>
		<TonConnectUIProvider manifestUrl={manifest}>
			{props.children}
		</TonConnectUIProvider>
		</body>
		</html>
	);
};

export default Layout;
