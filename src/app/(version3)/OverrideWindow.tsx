'use client';
import {useEffect, useRef, useState} from "react";
import {useOs} from "@mantine/hooks";
import {serverLog} from "@v3/actions";

const OverrideWindow = () => {
	const [style, setStyle] = useState("");
	const os = useOs();
	const init = useRef(false);

	useEffect(() => {
		if (os === "undetermined" || init.current) return;
		init.current = true;

		serverLog(`Platform ${os}`).catch(console.error)
		const origin = window.open;
		//@ts-ignore
		window.open = (href, target, o) => {
			serverLog(`Opening[${os}]`, href).catch(console.error);
			try {
				window.Telegram.WebApp.openLink(href?.toString?.() || href + "", {
					try_instant_view: false
				});
			} catch (e) {
				serverLog("open Err", e).catch()
				window.Telegram.WebApp.openLink(href?.toString?.() || href + "", {
					try_instant_view: true
				});
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
	}, [os])
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
