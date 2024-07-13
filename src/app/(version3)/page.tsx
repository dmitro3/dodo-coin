import Navbar from "@v3/components/Navbar";
import "./style.css"
import React from "react";
import SetUser from "@v3/SetUser";
import {getUser} from "@backend/utils/user";

const Page = async () => {
	const user = await getUser();

	return (
		<div className={'relative'}>
			<div className="bg">
				<div className="slider-thumb"/>
			</div>
			<main className={'holder'}>
				<div className="container" id="container" style={{position: "absolute"}}>
					<div className="profileData " style={{}}>

						<div className="profileData-name p-2">
							<div className="profileData-name-nick">{user?.username || "Loading"}</div>
							<div className="profileData-name-tag">@{user?.username ?? "loading"}</div>
						</div>
					</div>
					<div className="points" style={{}}>
						<img src="/logo.webp" alt="" style={{width: 50, height: 50}}/>
						50
					</div>
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
						<div className="farmButton bg-1">
							<div className="button-title" style={{fontSize: 42}}>
								Farm
							</div>
						</div>
					</div>
				</div>

			</main>
			<Navbar/>
		</div>
	);
};

export default Page;
