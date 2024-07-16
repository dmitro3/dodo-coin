'use client';
import {useEffect, useState} from "react";

const OverrideWindow = () => {
	const [style, setStyle] = useState("");
	useEffect(()=>{
		const origin = window.open;

		//@ts-ignore
		window.open = (href,target,o)=>{
			origin(href,'_blank',o);
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
