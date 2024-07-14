'use client';

import React from "react";
import {TonConnectUIProvider} from '@tonconnect/ui-react';

const Layout = (props: any) => {
	const manifest = `http://192.168.1.105:3000/tonconnect-manifest.json`;
	console.log(manifest);
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
