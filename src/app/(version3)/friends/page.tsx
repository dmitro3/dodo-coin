import {getFriends} from "@v3/friends/actions";
import "./style.css"
import Navbar from "@v3/components/Navbar";
import family from "./img.png";
import Image from "next/image";
import React from "react";
import InviteButton from "@v3/friends/InviteButton";
import Big from "big.js";
import {PerFriendBonus} from "@/bot/classes/DodoBot";

const Page = async () => {
	const {friends, total} = await getFriends();
	const empty = friends.length === 0;

	return (
		<div>
			<main>
				<div data-v-5a91f047="" className="frens-page page">
					<div data-v-55492676="" data-v-5a91f047="" className="pages-frens">
						{empty ? (
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
										className="emoji  relative top-10 v"
									/>
									<div data-v-97c098d1="" className="title">
										{" "}
										Invite frens. Earn
										<br data-v-97c098d1=""/> points{" "}
									</div>
								</div>
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
							</div>
						) : (
							<>
								<div
									data-v-fa52f77d=""
									data-v-55492676=""
									className="pages-frens-list-heading list-heading"
								>
									<div data-v-fa52f77d="" className="heading">
										<Image
											data-v-97c098d1=""
											src={family}
											alt="Friends emoji"
											className="emoji w-[50px] relative top-10"
										/>
										<div data-v-fa52f77d="" className="title">
											Invite Frens
										</div>
									</div>
									<br/>
								</div>
								<div data-v-51de0b63="" data-v-55492676="" className="pages-frens-list min-w-[300px]">
									<div data-v-51de0b63="" className="counter">
										{friends.length} fren
									</div>
									<div data-v-51de0b63="" className="list">
										{friends.map(f => {
											const rand = f.joined_at.getTime() % 4;
											return (
												(
													<div
														data-v-97259735=""
														data-v-51de0b63=""
														className="pages-frens-list-item"
														key={f.id}
													>
														<div data-v-97259735="" className="avatar">
															<div data-v-97259735="" className={`letter ${
																rand === 0 ? "bg-red-400":
																rand === 1 ? "bg-green-400":
																rand === 2 ? "bg-blue-400": 
																rand === 3 ? "bg-emerald-400": 
																"bg-primary"
															}`}>
																{f.username?.slice(0, 1).toUpperCase()}
															</div>
														</div>
														<div data-v-97259735="" className="details">
															<div data-v-97259735="" className="username">
																{f.username}
															</div>
															<div data-v-97259735=""
																className="frens-count-compose">
																<div data-v-97259735="" className="kit-icon icon">
																	{f.joined_at.toLocaleDateString()}
																</div>
															</div>
														</div>
														<div data-v-97259735="" className="balance flex gap-1 items-center">
															{f.wallet.toFixed(2)}
															<img
																src={'/logo.webp'} style={{
																width: "20px",
																height: "20px",
																objectFit: "cover"
															}}/>
														</div>
													</div>
												)
											)
										})}
									</div>
									{total > 5 && (
										<p className={'p-2'}>{total - 5}+ More...</p>
									)}
								</div>

							</>
						)}
						<div data-v-55492676="" className="invite-button-wrapper">
							<div
								data-v-a174c313=""
								data-v-55492676=""
								className="pages-frens-invite-button"
							>
								<InviteButton />
							</div>
						</div>
						{/**/}
						{/**/}
					</div>
				</div>
			</main>
			<Navbar/>
		</div>
	);
};

export default Page;
