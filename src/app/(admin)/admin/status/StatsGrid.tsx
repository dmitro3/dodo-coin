import { Group, Paper, SimpleGrid, Text } from '@mantine/core';

import classes from './StatsGrid.module.css';

const ExampleData = [
	{ title: 'Revenue', value: '13,456', diff: 34 },
	{ title: 'Profit', value: '4,145', diff: -13 },
	{ title: 'Coupons usage',  value: '745', diff: 18 },
	{ title: 'New customers',  value: '188', diff: -30 },
];

export default function StatsGrid(props: {
	stats: typeof ExampleData
}) {
	const data = props.stats
	const stats = data.map(stat => (<StatItem data={stat} />));
	return (
		<div className={classes.root}>
			<SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
		</div>
	);
}

export function StatItem(props: {
	data: (typeof ExampleData)[number] & {
		description?: string
	}
}) {
	let {data} = props;
	return (
		<Paper withBorder p="md" radius="md" key={data.title}>
			<Group justify="space-between">
				<Text size="xs" c="dimmed" className={classes.title}>
					{data.title}
				</Text>
			</Group>

			<Group align="flex-end" gap="xs" mt={25}>
				<Text className={classes.value}>{data.value}</Text>
				<Text c={data.diff > 0 ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
					<span>{data.diff}%</span>
				</Text>
			</Group>

			<Text fz="xs" c="dimmed" mt={7}>
				{data?.description}
			</Text>
		</Paper>
	);
}
