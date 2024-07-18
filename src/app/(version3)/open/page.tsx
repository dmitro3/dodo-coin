'use client';

import LoadingOverlay from "@v3/components/LoadingOverlay";
import {useEffect} from "react";

const Page = () => {
	const url = new URL(window.location.href);

	useEffect(()=>{
		
	}, [url])

	return <LoadingOverlay />;
};

export default Page;
