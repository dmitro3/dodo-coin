import {getFriends} from "@v3/friends/actions";
import "./style.css"
import Navbar from "@v3/components/Navbar";
import family from "./img.png";
import Image from "next/image";
import React from "react";
import InviteButton from "@v3/friends/InviteButton";

const Page = async () => {
	const friends = await getFriends();

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
										className="emoji"
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
						): (
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
											className="emoji w-[50px]"
										/>
										<div data-v-fa52f77d="" className="title">
											Invite Frens
										</div>
									</div>
									<div data-v-fa52f77d="" className="claim-zone">
										<div data-v-fa52f77d="" className="claim-balance">
											<img
												data-v-fa52f77d=""
												src="/logo.webp"
												alt="Blum logo"
											/>
											<div
												data-v-191230a7=""
												data-v-c2615662=""
												data-v-fa52f77d=""
												className="kit-counter-animation"
											>
												<div data-v-191230a7="" className="el-char-wrapper">
													<div data-v-191230a7="" className="el-char">
														5
													</div>
												</div>
											</div>
										</div>
										<button data-v-fa52f77d="" className="claim-button is-active">
											Claim
										</button>
										{/**/}
										{/**/}
									</div>
									<div data-v-fa52f77d="" className="disclaimer">
										{" "}
										Score 10% from buddies + 2.5% from their referrals <br
										data-v-fa52f77d=""/>{" "}
										Get a <i data-v-fa52f77d="" className="ticket"/> play pass for each
										fren.{" "}
									</div>
								</div>
								<div data-v-51de0b63="" data-v-55492676="" className="pages-frens-list">
									<div data-v-51de0b63="" className="counter">
										{friends.length} fren
									</div>
									<div data-v-51de0b63="" className="list">
										{friends.map(f => (
											<div
												data-v-97259735=""
												data-v-51de0b63=""
												className="pages-frens-list-item"
												key={f.id}
											>
												<div data-v-97259735="" className="avatar">
													<div data-v-97259735="" className="letter">
														{f.username?.slice(0,1).toUpperCase()}
													</div>
												</div>
												<div data-v-97259735="" className="details">
													<div data-v-97259735="" className="username">
														{f.username}
													</div>
													<div data-v-97259735=""
														className="frens-count-compose">
														<div data-v-97259735="" className="kit-icon icon">
															<svg
																width={24}
																height={24}
																viewBox="0 0 24 24"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<g id="Style=Line">
																	<path
																		id="Vector"
																		d="M21 19.9999C21 18.2583 19.3304 16.7767 17 16.2275M15 20C15 17.7909 12.3137 16 9 16C5.68629 16 3 17.7909 3 20M15 13C17.2091 13 19 11.2091 19 9C19 6.79086 17.2091 5 15 5M9 13C6.79086 13 5 11.2091 5 9C5 6.79086 6.79086 5 9 5C11.2091 5 13 6.79086 13 9C13 11.2091 11.2091 13 9 13Z"
																		stroke="white"
																		strokeWidth={2}
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	/>
																</g>
															</svg>
														</div>
														<div data-v-97259735="" className="counter">
															0
														</div>
													</div>
												</div>
												<div data-v-97259735="" className="balance">
													56 BP
												</div>
											</div>
										))}
									</div>
								</div>

							</>
						)}
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
			<Navbar/>
		</div>
	);
};

export default Page;
