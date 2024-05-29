'use client';

const OverrideWindow = () => {



	return (
		<div>

		</div>
	);
};

if (typeof window !== 'undefined') {
	for (let key of ['log', 'warn', 'error']) {
		const K = key as keyof typeof console;
		const origin = console[K] as typeof console.log;

		///@ts-ignore
		console[K] = (...args)=>{
			
			return origin(...args);
		}
	}
}

export default OverrideWindow;
