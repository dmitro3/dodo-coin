import {defaultV3Config, getV3ConfigValue, V3Config} from "@v3/@special/config";
import {TextInput} from "@mantine/core";

const Page = async () => {
	return (
		<form className={'flex flex-col gap-3'}>
			{Object.keys(defaultV3Config).map(key => (
				<TextInput
					label={key}
					name={key}
					defaultValue={getV3ConfigValue(key as keyof V3Config)}
				/>
			))}
		</form>
	);
};

export default Page;
