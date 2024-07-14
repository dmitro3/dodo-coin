import {defaultV3Config, getV3ConfigValue, V3Config} from "@v3/@special/config";
import {Button, TextInput} from "@mantine/core";
import React from "react";

const Page = async () => {
	return (
		<form className={'flex flex-col gap-3 '}>
			{Object.keys(defaultV3Config).map(key => (
				<TextInput
					label={key}
					name={key}
					defaultValue={getV3ConfigValue(key as keyof V3Config)}
				/>
			))}
			<div>
				<Button type={'submit'}>
					Save
				</Button>
			</div>
		</form>
	);
};

export default Page;
