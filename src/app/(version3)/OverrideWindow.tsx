'use client';
import React, {useEffect, useRef, useState} from "react";
import {useOs} from "@mantine/hooks";
import {serverLog} from "@v3/actions";
import spinner from "@v3/assets/images/spinner.png";
import Image from "next/image";

declare global {
	var telegramExit: (url: string)=>void
}

const OverrideWindow = () => {
	const [style, setStyle] = useState("");
	const os = useOs();
	const init = useRef(false);
	const [exitLink, setExitLink] = useState<string>();
	if (typeof window !== 'undefined') {
		window.telegramExit = setExitLink;
	}


	useEffect(() => {
		if (os === "undetermined" || init.current) return;
		init.current = true;

		serverLog(`Platform ${os}`).catch(console.error)
		const origin = window.open;
		//@ts-ignore
		window.open = (href, target, o) => {
			if (window.location.pathname.endsWith("open")) return origin(href,target,o);

			const finalLink = href?.toString?.() || href + "";
			serverLog(`Opening[${os}]`, finalLink).catch(console.error);
			try {
				window.telegramExit(finalLink)
			} catch (e: any) {
				serverLog("open Err", e?.message ?? e+"").catch()
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
			{!!exitLink && (
				<div className={'fixed flex-col gap-2 p-3 h-screen w-screen bg-black text-white flex items-center justify-center text-lg z-[999999]'}>
					<Image width={300} height={300} src={spinner} alt="" id="spinner"
						  className="spinner__image"
						  draggable="false"/>
					<p className={'text-center'}>Click here to Confirm Open External link to your browser</p>
					<button onClick={()=>{
						window.Telegram.WebApp.openLink(`${window.location.origin}/open?url=${encodeURIComponent(exitLink)}`, {
							try_instant_view: false
						});
					}}>
						Confirm
					</button>
				</div>
			)}
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
