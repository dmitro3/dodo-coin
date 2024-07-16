'use client'

import {useEffect, useState} from "react";
import {setCurrentUser} from "@v3/actions";
import {useRouter} from "next/navigation";
import {PrismaModelType} from "@backend/modules/prisma/Prisma";

declare global {
	var user: PrismaModelType<'user'> | undefined
}

const SetUser = () => {
	const router= useRouter();
	useEffect(() => {
		setCurrentUser(new URL(window.location.href).searchParams.get('token')+"").then((u)=>{
			router.refresh();
			window.user = u;
		}).catch(console.error)
	}, []);
	return null;
};

export default SetUser;
