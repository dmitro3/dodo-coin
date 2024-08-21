'use client';
import React, {useEffect, useRef, useState} from "react";
import {useOs} from "@mantine/hooks";
import {serverLog} from "@v3/actions";
import spinner from "@v3/v3/assets/images/spinner.png";
import Image from "next/image";

declare global {
	var telegramExit: (o: ExLink)=>void
}

type ExLink = {
	url: string,
	target: string,
	features: string
};

const OverrideWindow = () => {
	const [style, setStyle] = useState("");
	const os = useOs();
	const init = useRef(false);
	const [exitLink, setExitLink] = useState<ExLink>();
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
			try {
				const url = new URL(href+"");
				if (url.host === window.location.host || window.location.pathname.endsWith("open"))
					return origin(href,target,o);
			} catch {}

			const finalLink = href?.toString?.() || href + "";
			serverLog(`Opening[${os}]`, finalLink).catch(console.error);
			try {
				if (os === 'ios') {
					window.telegramExit({
						url: finalLink,
						target: target+"",
						features: o+""
					})
				} else {
					return origin(href,"_blank", o);
				}
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
				<div onClick={()=>{
					const u = new URL(window.location.origin);
					u.pathname = '/open';
					for (let [k, v] of Object.entries(exitLink)) {
						u.searchParams.set(k,v);
					}
					window.Telegram.WebApp.openLink(u.toString(), {
						try_instant_view: false
					});
					setExitLink(undefined);
				}} className={'fixed flex-col gap-2 p-3 h-screen w-screen bg-black text-white flex items-center justify-center text-lg z-[999999]'}>
					<Image width={300} height={300} src={spinner} alt="" id="spinner"
						  className="spinner__image"
						  draggable="false"/>
					<p className={'text-center'}>Click here to Confirm Open External link to your browser</p>
					<button>
						Confirm
					</button>
				</div>
			)}
		</>
	);
};


export default OverrideWindow;
