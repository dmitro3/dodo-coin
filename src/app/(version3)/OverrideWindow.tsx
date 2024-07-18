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
				origin(href, "_blank",o)
			} else if (os === "ios") {
				
			} else {
				origin(href,target,o);
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

export default OverrideWindow;
