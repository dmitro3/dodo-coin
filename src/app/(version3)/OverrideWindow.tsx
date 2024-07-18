'use client';
import {useEffect, useState} from "react";
import {useOs} from "@mantine/hooks";
import {serverLog} from "@v3/actions";

const OverrideWindow = () => {
	const [style, setStyle] = useState("");
	const os = useOs();

	useEffect(() => {

		const origin = window.open;
		//@ts-ignore
		window.open = (href, target, o) => {
			if (os === "android") {
				return origin(href, "_blank", o)
			} else if (os === "ios") {
				forceOpenLink(href?.toString?.() || href + "").catch(console.error);
			} else {
				return origin(href, target, o);
			}
		}

		if (window.Telegram) {
			window.Telegram.WebApp.onEvent("viewportChanged", () => {
				setStyle(`
				:root {
				--vh: ${window.Telegram.WebApp.viewportHeight}px
				}
				`);
			})
		}
	}, [])
	return (
		<>
			<style dangerouslySetInnerHTML={{__html: style}}></style>
		</>
	);
};

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

export default OverrideWindow;
