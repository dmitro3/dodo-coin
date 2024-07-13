'use client';

import {AppShell, Burger, Group, NavLink, Skeleton} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import "@mantine/core/styles.css"
import {usePathname} from "next/navigation";
import {ComponentProps} from "react";


const links = [
	{
		label: "Status"
	},
	{
		label: "Scammed"
	},
	{
		label: "Config",
	},
	{
		label: "Config",
	},
]

export default function BasicAppShell(props: any) {
	const [opened, { toggle }] = useDisclosure();
	const path = usePathname();


	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
			padding="md"
		>
			<AppShell.Header>
				<Group h="100%" px="md">
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<img src={'/logo.webp'} alt={'logo'} style={{
						width: "40px",
						objectFit: "contain"
					}} />
					Dodo Admin
				</Group>
			</AppShell.Header>
			<AppShell.Navbar p="md">
				Navbar
				<br/>
				<br/>

			</AppShell.Navbar>
			<AppShell.Main>
				{props.children}
			</AppShell.Main>
		</AppShell>
	);
}
