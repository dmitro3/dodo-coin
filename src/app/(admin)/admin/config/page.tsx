import {defaultV3Config, getV3ConfigValue, setV3Config, V3Config} from "@/old/@special/config";
import {Button, TextInput} from "@mantine/core";
import React from "react";
import {redirect} from "next/navigation";

const Page = async () => {
	return (
		<form className={'flex flex-col gap-3 '} action={async (data)=>{
			'use server';

			const config = Object.fromEntries(data.entries());
			await setV3Config(config);
			redirect("?saved")
		}}>
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
