"use client";

import {useEffect, useState} from "react";
import {usePathname, useSearchParams} from "next/navigation";
import LoadingOverlay from "@v3/components/LoadingOverlay";


export let __PAGE_LOAD: any = () => {
}

export function usePageLoading() {
	const [loading, setLoading] = useState(false);
	const pathname = usePathname();
	const search = useSearchParams();

	function registerLinks() {


		const links = window?.document?.querySelectorAll('a:not(a[registered="true"],a[target="_blank"]), button[data-changer]:not(button[registered="true"])');

		links.forEach(link => {
			const href = link?.getAttribute("href") + "";

			if (href.startsWith("#")) return;

			link.addEventListener('click', () => {
				if (href === pathname) return;
				setLoading(true);
			});
			link.setAttribute("registered", "true");
		})
	}

	useEffect(() => {
		__PAGE_LOAD = setLoading;
		setLoading(false);

		let thread = setInterval(registerLinks, 500);
		return () => clearInterval(thread)
	}, [pathname, search])


	return loading;
}


const PageLoader = (props: any) => {
	const loading = usePageLoading();


	return (
		<>
			{loading+""}
			{loading && (
				<div className={'fixed h-full w-full left-0 top-0 bg-white z-50'}>
					<LoadingOverlay />
				</div>
			)}
			{props?.children}
		</>
	)
}

export default PageLoader;
