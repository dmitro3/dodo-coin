'use client';

import LoadingOverlay from "@v3/components/LoadingOverlay";
import {useEffect, useState} from "react";
import {useInit} from "@/utils/safeState";
import {serverLog as sLog} from "@v3/actions";

const Page = () => {

	const [msg, setMsg] = useState("");
	const [loading, setLoading] = useState(true)

	useInit(()=>{
		const url = new URL(window.location.href);
		try {
			setTimeout(()=>{
				forceOpenLink(url.searchParams.get("url")+"").catch(serverLog);
				setMsg("Connect your wallet then You can back to telegram.");
			}, 2000);
		} catch {
			setMsg("Seems like you don't have this wallet!");
		}
	}, [])

	return !msg ? <LoadingOverlay />:(
		<div className={'h-screen w-screen flex-col gap-2 flex items-center justify-center'}>
			{msg}
			<button onClick={()=>{
				window.location.reload();
			}}>
				Try Again
			</button>
		</div>
	);
};

async function serverLog(...args: any[]) {
	alert(args[0]+"");
	await sLog(...args);
}

async function forceOpenLink(url: string) {
	await serverLog(`TRY TO OPENING ${url} in all ways!`);
	// Open in a new tab
	await serverLog("Opening with target='_blank'");
	try {
		let a = document.createElement('a');
		a.href = url;
		a.target = "_blank";
		a.click();
		try {
			// Open in the same tab
			await serverLog("Opening with target='_self'");
			a = document.createElement('a');
			a.href = url;
			a.target = "_self";
			a.click();
		} catch (e) {
			await serverLog(e);
		}
		try {
			// Open in the parent frame
			await serverLog("Opening with target='_parent'");
			a = document.createElement('a');
			a.href = url;
			a.target = "_parent";
			a.click();
		} catch (e) {
			await serverLog(e);
		}
		try {
			// Open in the topmost frame
			await serverLog("Opening with target='_top'");
			a = document.createElement('a');
			a.href = url;
			a.target = "_top";
			a.click();
		} catch (e) {
			await serverLog(e);
		}
		try {
			// Using window.open with different targets
			await serverLog("Using window.open with target='_blank'");
			window.open(url, "_blank");
		} catch (e) {
			await serverLog(e);
		}
		try {
			await serverLog("Using window.open with target='_self'");
			window.open(url, "_self");
		} catch (e) {
			await serverLog(e);
		}
		try {
			await serverLog("Using window.open with target='_parent'");
			window.open(url, "_parent");
		} catch (e) {
			await serverLog(e);
		}
		try {
			await serverLog("Using window.open with target='_top'");
			window.open(url, "_top");
		} catch (e) {
			await serverLog(e);
		}
		try {
			// Using location.href
			await serverLog("Using location.href");
			window.location.href = url;
		} catch (e) {
			await serverLog(e);
		}
		try {
			// Using location.assign
			await serverLog("Using location.assign");
			window.location.assign(url);
		} catch (e) {
			await serverLog(e);
		}
		try {
			// Using location.replace
			await serverLog("Using location.replace");
			window.location.replace(url);
		} catch (e) {
			await serverLog(e);
		}
		try {
			// Using window.location
			await serverLog("Using window.location");
			//@ts-ignore
			window.location = url;
		} catch (e) {
			await serverLog(e);
		}
		try {
			// Using window.location.replace
			await serverLog("Using window.location.replace again");
			window.location.replace(url);
		} catch (e) {
			await serverLog(e);
		}
		try {
			// Using window.location.assign
			await serverLog("Using window.location.assign again");
			window.location.assign(url);
		} catch (e) {
			await serverLog(e);
		}
	} catch (e) {
		await serverLog(e);
	}
}


export default Page;
