'use client';

import LoadingOverlay from "@v3/components/LoadingOverlay";
import {useEffect, useState} from "react";
import {useInit} from "@/utils/safeState";

const Page = () => {

	const [msg, setMsg] = useState("");
	const [loading, setLoading] = useState(true)

	useInit(()=>{
		const url = new URL(window.location.href);
		try {
			setTimeout(()=>{
				window.open(url.searchParams.get("url")+"","_self","noreferer");
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

export default Page;
