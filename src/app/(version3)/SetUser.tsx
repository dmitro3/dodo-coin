'use client'

import {useEffect} from "react";

const SetUser = () => {
	useEffect(() => {
		setCurrentUser(new URL(window.location.href).searchParams.get('token'))
	}, []);
	return null;
};

export default SetUser;
