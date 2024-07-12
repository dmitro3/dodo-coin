import {getFriends} from "@v3/friends/actions";
import "./style.css"
import Navbar from "@v3/components/Navbar";
import family from "./img.png";
import Image from "next/image";
import React from "react";
const Page = async () => {
	const friends = await getFriends()

	return (
		<div>
			<main>
				<div data-v-5a91f047="" className="frens-page page">
					<div data-v-55492676="" data-v-5a91f047="" className="pages-frens">
						<div
							data-v-97c098d1=""
							data-v-55492676=""
							className="pages-frens-empty-state"
						>
							<div data-v-97c098d1="" className="heading">
								<Image
									data-v-97c098d1=""
									src={family}
									alt="Friends emoji"
									className="emoji"
								/>
								<div data-v-97c098d1="" className="title">
									{" "}
									Invite frens. Earn
									<br data-v-97c098d1=""/> points{" "}
								</div>
								{/**/}
							</div>
							{/*friends.length === 0*/ "true" === 'true' ? (
								<div data-v-97c098d1="" className="how-it-works">
									<div data-v-97c098d1="" className="title">
										How it works
									</div>
									<div data-v-97c098d1="" className="chain">
										<div data-v-97c098d1="" className="chain-element">
											<div data-v-97c098d1="" className="point-container">
												<div data-v-97c098d1="" className="stick"/>
												<div data-v-97c098d1="" className="point"/>
												<div data-v-97c098d1="" className="stick"/>
											</div>
											<div data-v-97c098d1="" className="content-container">
												<div data-v-97c098d1="" className="content-title">
													Share your invitation link
												</div>
												<div data-v-97c098d1="" className="content-subtitle">
													Get Bonus for each frens
												</div>
											</div>
										</div>
										<div data-v-97c098d1="" className="chain-element">
											<div data-v-97c098d1="" className="point-container">
												<div data-v-97c098d1="" className="stick"/>
												<div data-v-97c098d1="" className="point"/>
												<div data-v-97c098d1="" className="stick"/>
											</div>
											<div data-v-97c098d1="" className="content-container">
												<div data-v-97c098d1="" className="content-title">
													Your friends join Dodo
												</div>
												<div data-v-97c098d1="" className="content-subtitle">
													And start farming points
												</div>
											</div>
										</div>
										<div data-v-97c098d1="" className="chain-element">
											<div data-v-97c098d1="" className="point-container">
												<div data-v-97c098d1="" className="stick"/>
												<div data-v-97c098d1="" className="point"/>
												<div data-v-97c098d1="" className="stick"/>
											</div>
											<div data-v-97c098d1="" className="content-container">
												<div data-v-97c098d1="" className="content-title">
													Score 10% from buddies
												</div>
												<div data-v-97c098d1="" className="content-subtitle">
													Plus an extra 2.5% from their referrals
												</div>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div>

								</div>
							)}
						</div>
						<div data-v-55492676="" className="invite-button-wrapper">
							<div
								data-v-a174c313=""
								data-v-55492676=""
								className="pages-frens-invite-button"
							>
								<InviteButton/>
							</div>
						</div>
						{/**/}
						{/**/}
					</div>
				</div>
			</main>
			<Navbar />
		</div>
	);
};

export default Page;
