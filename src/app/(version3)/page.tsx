import Navbar from "@v3/components/Navbar";
import "./style.css"
import React from "react";
import {getUserFromCookies} from "@/utils/serverComponents/user";
import FarmButton from "@v3/FarmButton";
import Boost from "@v3/components/modal-windows/Boost";
import ClaimButton from "@v3/ClaimButton";

const Page = async () => {
	const user = await getUserFromCookies();

	return (
		<div className={'relative'}>

			<div className={'relative z-20'}>
				<main className={'holder relative'}>
					<div className="bg relative z-0">
						<div className="slider-thumb"/>
					</div>
					<div className=" flex flex-col gap-4 items-center justify-between relative z-20 h-[calc(100vh-200px)]">
						<div className="profileData " style={{}}>

							<div className="profileData-name p-2 px-4">
								<div className="profileData-name-nick font-bold tracking-widest text-lg">{user?.username || "Loading"}</div>
							</div>
						</div>
						{!!user ? (
							<>
								<div className={'flex flex-col justify-center items-center gap-2'}>
									<div className="points" style={{}}>
										<img src="/logo.webp" alt="" style={{width: 50, height: 50}}/>
										{user.wallet.toLocaleString()}
									</div>
									<div className="flex gap-1 items-center gap-2" style={{}}>
										<svg
											id="Layer_1"
											style={{
												width: "25px",
											}}
											data-name="Layer 1"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 339.43 295.27"
										>
											<title>tether-usdt-logo</title>
											<path
												d="M62.15,1.45l-61.89,130a2.52,2.52,0,0,0,.54,2.94L167.95,294.56a2.55,2.55,0,0,0,3.53,0L338.63,134.4a2.52,2.52,0,0,0,.54-2.94l-61.89-130A2.5,2.5,0,0,0,275,0H64.45a2.5,2.5,0,0,0-2.3,1.45h0Z"
												style={{fill: "#50af95", fillRule: "evenodd"}}
											/>
											<path
												d="M191.19,144.8v0c-1.2.09-7.4,0.46-21.23,0.46-11,0-18.81-.33-21.55-0.46v0c-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25,74.24-18.15v28.91c2.78,0.2,10.74.67,21.74,0.67,13.2,0,19.81-.55,21-0.66v-28.9c42.42,1.89,74.08,9.29,74.08,18.13s-31.65,16.24-74.08,18.12h0Zm0-39.25V79.68h59.2V40.23H89.21V79.68H148.4v25.86c-48.11,2.21-84.29,11.74-84.29,23.16s36.18,20.94,84.29,23.16v82.9h42.78V151.83c48-2.21,84.12-11.73,84.12-23.14s-36.09-20.93-84.12-23.15h0Zm0,0h0Z"
												style={{fill: "#fff", fillRule: "evenodd"}}
											/>
										</svg>
										<p className={'text-sm'}>{user.usdtBalance.toLocaleString()}</p>
									</div>
								</div>
								<FarmButton user={user}/>
								<div className={'flex gap-2 w-full items-center'}>
									<ClaimButton user={user} />
									<a href={'#boost'} className={'flex-grow'}>
										<button className={'w-full'}>
											Boost
										</button>
									</a>
									<Boost user={user} />
								</div>
								<br/>
								<br/>
							</>
						) : (
							<div className={'min-h-[300px] flex justify-center items-center'}>
								<h2 className={'text-4xl tracking-widest'}>Loading...</h2>
							</div>
						)}
					</div>
				</main>
				<div className={'relative z-20'}>
					<Navbar/>
				</div>
			</div>

		</div>
	);
};

export default Page;
