import Navbar from "@v3/components/Navbar";
import "./style.css"
import React from "react";
import {getUserFromCookies} from "@/utils/serverComponents/user";
import FarmButton from "@v3/FarmButton";

const Page = async () => {
	const user = await getUserFromCookies();



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
					{!!user ? (
						<>
							<div className="points" style={{}}>
								<img src="/logo.webp" alt="" style={{width: 50, height: 50}}/>
								50
							</div>
							<FarmButton />
						</>
					):(
						<div className={'min-h-[300px] flex justify-center items-center'}>
							<h2 className={'text-4xl tracking-widest'}>Loading...</h2>
						</div>
					)}
				</div>

			</main>
			<Navbar/>
		</div>
	);
};

export default Page;
