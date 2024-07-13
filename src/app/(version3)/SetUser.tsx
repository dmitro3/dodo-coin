'use client'

import {useEffect} from "react";
import {setCurrentUser} from "@v3/actions";
import {useRouter} from "next/navigation";

const SetUser = () => {
	const router= useRouter();
	useEffect(() => {
		setCurrentUser(new URL(window.location.href).searchParams.get('token')+"").catch(console.error).then(router.refresh)
	}, []);
	return null;
};

export default SetUser;
