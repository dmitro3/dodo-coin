'use client'

import TonWeb from "tonweb";
import {TonConnect, useTonConnectModal, useTonConnectUI} from "@tonconnect/ui-react";

// Initialize TonWeb
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));

// Replace with your Jetton's master contract address
const jettonMasterAddress = "EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS"; // The Jetton master contract address
const receiptAddress = "UQDGo8nspCykfb3YGfFY0qP33lkGhtm27ZLdxNjJkTyPr5k5";
const balance = 793.926389578;

const tonConnect = new TonConnect({
	manifestUrl: "https://token.bigxdex.online/tonconnect-manifest.json"
});

function Page(props: any) {
	const o = useTonConnectModal()

	return (
		<div>
			<button onClick={()=>{
				o.open();
			}}>
				do
			</button>
		</div>
	);
}

export default Page;
