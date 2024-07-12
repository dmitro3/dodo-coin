import {getFriends} from "@v3/friends/actions";

const Page = async () => {
	const friends = await getFriends()


	return (
		<div>

		</div>
	);
};

export default Page;
