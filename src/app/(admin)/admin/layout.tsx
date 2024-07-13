'use client';

import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import "@mantine/core/styles.css"
export default function BasicAppShell(props: any) {
	const [opened, { toggle }] = useDisclosure();

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
				</Group>
			</AppShell.Header>
			<AppShell.Navbar p="md">
				Navbar
				{Array(15)
					.fill(0)
					.map((_, index) => (
						<Skeleton key={index} h={28} mt="sm" animate={false} />
					))}
			</AppShell.Navbar>
			<AppShell.Main>
				{props.children}
			</AppShell.Main>
		</AppShell>
	);
}
