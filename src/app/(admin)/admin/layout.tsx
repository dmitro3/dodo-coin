'use client';

import {AppShell, Burger, Group, NavLink, Skeleton} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import "@mantine/core/styles.css"
import {usePathname} from "next/navigation";
import {ComponentProps, useEffect} from "react";
import Link from "next/link";


const links = [
	{
		label: "Status",
		href: "/admin"
	},
	{
		label: "Scams"
	},
	{
		label: "Config",
	}
]

export default function BasicAppShell(props: any) {
	const [opened, { toggle ,close}] = useDisclosure();
	const path = usePathname();

	useEffect(close,[path])

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
				{links.map(link => {
					const href = link.href || `/admin/${link?.label.toLowerCase()}`;
					return (
						<NavLink
							active={href === path}
							href={href}
							component={Link}
							label={link.label}
						/>
					)
				})}
			</AppShell.Navbar>
			<AppShell.Main>
				{props.children}
			</AppShell.Main>
		</AppShell>
	);
}
