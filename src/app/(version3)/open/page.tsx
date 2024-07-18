'use client';

import LoadingOverlay from "@v3/components/LoadingOverlay";
import {useEffect, useState} from "react";

const Page = () => {
	const url = new URL(window.location.href);
	const [loading, setLoading] = useState(true)

	useEffect(()=>{
		window.open(url.searchParams.get("url")+"","_self","noreferer");
	}, [url])

	return loading ? <LoadingOverlay />:(
		<div className={'h-screen w-screen flex items-center justify-center'}>
			Close this tab, You can back to telegram.
		</div>
	);
};

export default Page;
