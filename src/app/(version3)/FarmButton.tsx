'use client'

import {useEffect, useMemo, useState} from "react";

const FarmButton = () => {
	const [active, setActive] = useState(false);
	const [activedAt, setActivedAt] = useState<Date>();
	const [expiredAt, setExpiredAt] = useState<Date>();
	const [currentState, setCurrentState] = useState(0)
	const maxHour = 8;

	useEffect(() => {
		if (activedAt) {
			const c = new Date(activedAt);
			c.setMinutes(c.getMinutes() + maxHour);
			setExpiredAt(c);
		}
	}, [activedAt]);
	useEffect(() => {
		setActivedAt(new Date())
	}, [active]);
	useEffect(()=>{
		if (activedAt && expiredAt && active) {
			const thread = setInterval(()=>{
				const now = new Date();

				const diff = expiredAt.getTime() - now.getTime();
				const allDiff = expiredAt.getTime() - activedAt.getTime();
				const state = 100 - (diff / allDiff * 100);
				setCurrentState(state);
				if (state >= 100) {
					clearInterval(thread);
					setActive(false);
				}
			}, 1000);
			return ()=>clearInterval(thread);
		}
	}, [active,expiredAt,activedAt])
	const remaining = useMemo(()=>{
		if (currentState === 0 || !expiredAt) return undefined;

		const allDiff = expiredAt?.getTime() - new Date().getTime();

		const seconds = allDiff / 1000;
		const minutes = seconds / 60;
		const hours = minutes / 60;

		return {
			seconds: Math.round(seconds),
			minutes: Math.round(minutes),
			hours: Math.round(hours),
		}
	},[currentState]);

	return (
		<div className="ebat">
			<div id="cont" data-pct={100}>
				{currentState+""}
				{active ? (
					<svg
						id="svg"
						width={200}
						height={200}
						view-port="0 0 100 100"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
					>
						<defs>
							<linearGradient id="paint0_linear_4_261" gradientUnits="userSpaceOnUse">
								<stop stopColor="var(--secondary)"/>
								<stop offset={1} stopColor="var(--primary)"/>
							</linearGradient>
						</defs>
						<circle
							r={90}
							cx={100}
							stroke="#2D2D2D"
							cy={100}
							fill="transparent"
							strokeDasharray="565.48"
							strokeDashoffset={0}
							style={{strokeWidth: "1.28em"}}
						/>
						<circle
							id="bar"
							r={90}
							stroke="url(#paint0_linear_4_261)"
							strokeLinecap="round"
							cx={100}
							cy={100}
							fill="transparent"
							strokeDasharray="565.48"
							strokeDashoffset={0}
							style={{strokeWidth: "1.05em", strokeDashoffset: 565.48 - (565.48 / 100 * currentState)}}
						/>
					</svg>
				): (
					<svg
						id="svg"
						width={200}
						height={200}
						view-port="0 0 100 100"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
					>
						<defs>
							<linearGradient
								id="paint0_linear_4_261"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#F60150"/>
								<stop offset={1} stopColor="#F8792D"/>
							</linearGradient>
						</defs>
						<circle
							r={90}
							cx={100}
							stroke="#2D2D2D"
							cy={100}
							fill="transparent"
							strokeDasharray="565.48"
							strokeDashoffset={0}
							style={{strokeWidth: "0.3em"}}
						/>
						<circle
							id="bar"
							r={90}
							stroke="url(#paint0_linear_4_261)"
							strokeLinecap="round"
							cx={100}
							cy={100}
							fill="transparent"
							strokeDasharray="565.48"
							strokeDashoffset={0}
							style={{strokeWidth: "0.3em", strokeDashoffset: "565.487"}}
						/>
					</svg>
				)}

			</div>
			{active ? (
				<div className="farmButton bg-2 flex flex-col gap-2 items-stretch" style={{background: "none"}}>
					<div></div>
					<div className={'flex flex-col justify-center items-center gap-5'}>
						<div className="button-title" style={{fontSize: 42}}>
							Farming
						</div>
						<div className="collected">
							<img src="/logo.webp" alt="" style={{width: 25, height: 25}}/>
							36.355
						</div>
					</div>
					{remaining && (
						<div className="time">
							{remaining.hours && `${remaining.hours}h`}
							{remaining.minutes && `${remaining.minutes}m`}
							{remaining.seconds && `${remaining.seconds}s`}
						</div>
					)}

				</div>
			) : (
				<div className="farmButton bg-1 cursor-pointer" onClick={() => {
					setActive(true)
				}}>
					<div className="button-title" style={{fontSize: 42}}>
						Farm
					</div>
				</div>
			)}

		</div>
	);
};

export default FarmButton;
