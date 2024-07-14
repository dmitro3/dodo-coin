'use client';

import React from "react";
import {TonConnectButton, useTonAddress} from "@tonconnect/ui-react";

const Page = () => {
	const userFriendlyAddress = useTonAddress();
	const rawAddress = useTonAddress(false);

	return (
		<div className={'text-white'}>
			<TonConnectButton/>
			<div>
				<span>User-friendly address: {userFriendlyAddress}</span>
				<span>Raw address: {rawAddress}</span>
			</div>
		</div>
	);
};

export default Page;
