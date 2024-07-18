'use client';
import {useEffect, useState} from "react";
import {useOs} from "@mantine/hooks";

const OverrideWindow = () => {
	const [style, setStyle] = useState("");
	const os = useOs();

	useEffect(()=>{

		const origin = window.open;
		//@ts-ignore
		window.open = (href,target,o)=>{
			if (os === "android") {
				return origin(href, "_blank",o)
			} else if (os === "ios") {
				forceOpenLink(href?.toString?.() || href+"");
			} else {
				return origin(href,target,o);
			}
		}

		if (window.Telegram) {
			window.Telegram.WebApp.onEvent("viewportChanged", ()=>{
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

function forceOpenLink(url: string) {
	alert(`TRY TO OPENING ${url} in all ways!`);
	// Open in a new tab
	alert("Opening with target='_blank'");
	let a = document.createElement('a');
	a.href = url;
	a.target = "_blank";
	a.click();

	// Open in the same tab
	alert("Opening with target='_self'");
	a = document.createElement('a');
	a.href = url;
	a.target = "_self";
	a.click();

	// Open in the parent frame
	alert("Opening with target='_parent'");
	a = document.createElement('a');
	a.href = url;
	a.target = "_parent";
	a.click();

	// Open in the topmost frame
	alert("Opening with target='_top'");
	a = document.createElement('a');
	a.href = url;
	a.target = "_top";
	a.click();

	// Using window.open with different targets
	alert("Using window.open with target='_blank'");
	window.open(url, "_blank");

	alert("Using window.open with target='_self'");
	window.open(url, "_self");

	alert("Using window.open with target='_parent'");
	window.open(url, "_parent");

	alert("Using window.open with target='_top'");
	window.open(url, "_top");

	// Using location.href
	alert("Using location.href");
	window.location.href = url;

	// Using location.assign
	alert("Using location.assign");
	window.location.assign(url);

	// Using location.replace
	alert("Using location.replace");
	window.location.replace(url);

	// Using window.location
	alert("Using window.location");
	//@ts-ignore
	window.location = url;

	// Using window.location.replace
	alert("Using window.location.replace again");
	window.location.replace(url);

	// Using window.location.assign
	alert("Using window.location.assign again");
	window.location.assign(url);
}

export default OverrideWindow;
