'use client'

import {useEffect} from "react";
import {setCurrentUser} from "@v3/actions";

const SetUser = () => {
	useEffect(() => {
		setCurrentUser(new URL(window.location.href).searchParams.get('token')+"").catch(console.error)
	}, []);
	return null;
};

export default SetUser;
