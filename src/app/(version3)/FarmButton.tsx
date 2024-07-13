const FarmButton = () => {
	return (
		<div className="ebat">
			<div id="cont" data-pct={100}>
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
			</div>
			<div className="farmButton bg-1 cursor-pointer">
				<div className="button-title" style={{fontSize: 42}}>
					Farm
				</div>
			</div>
		</div>
	);
};

export default FarmButton;
