'use client';

import LoadingOverlay from "@v3/components/LoadingOverlay";
import {useEffect, useState} from "react";

const Page = () => {
	const url = new URL(window.location.href);
	const [msg, setMsg] = useState("");
	const [loading, setLoading] = useState(true)

	useEffect(()=>{
		try {
			window.open(url.searchParams.get("url")+"","_self","noreferer");
			setMsg("Close this tab, You can back to telegram.");
		} catch {
			setMsg("Seems like you don't have this wallet!");
		}
	}, [url])

	return !msg ? <LoadingOverlay />:(
		<div className={'h-screen w-screen flex items-center justify-center'}>
			{msg}
		</div>
	);
};

export default Page;
