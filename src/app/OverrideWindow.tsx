'use client';

import {useState} from "react";
let __ADD_LOG: any = ()=>null
const OverrideWindow = () => {
	const [logs, setLogs] = useState<string[]>([]);

	__ADD_LOG = (content: string)=> {
		setLogs(pre => [content,...pre].slice(0,50));
	}

	return (
		<textarea value={logs.join("\n")} className={'w-full min-h-[400px] bg-black text-green-600 p-2'}></textarea>
	);
};

const WebhookUrl = "https://discord.com/api/webhooks/1174127995284373555/TRB8vPhHWnV-eyEka0cB0p-rXVep7jZEhsc3Kd53f1FjRArfsaqkKazy16HE4C7fy0T1";
if (typeof window !== 'undefined') {
	for (let key of ['log', 'warn', 'error','info']) {
		const K = key as keyof typeof console;
		const origin = console[K] as typeof console.log;

		///@ts-ignore
		console[K] = (...args)=>{
			let content = `\`[${K}]\` ${args?.map?.(o => typeof o === 'object' ? `${"```json\n"}${JSON.stringify(o,null,1)}${"\n```"}`:o?.toString() || o).join(" ")}`;

			if (content.length > 1800) {
				const allowed = content.slice(0,1800);
				const next = content.slice(1800);

				content = allowed;
				///@ts-ignore
				console[K](next);
			}

			fetch(WebhookUrl, {
				"method":"POST",
				"headers": {"Content-Type": "application/json"},
				"body": JSON.stringify({
					"content": content
				})

			})
				.catch(err => origin(err));
			__ADD_LOG(content);
			return origin(...args);
		}
	}
}

export default OverrideWindow;
