'use client'

import {useEffect} from "react";
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
			const origin = window.open;

			//@ts-ignore
			window.open = (href,target,o)=>{
				origin(href,"_blank",o);
			}
		}).catch(console.error)
	}, []);
	return null;
};

export default SetUser;
