'use client'




import {sendInvite} from "@backend/api/player/send_invite/actions";

const InviteButton = () => {
	return (
		<button
			onClick={async ()=>{
				await sendInvite().catch(console.error);
				window.Telegram.WebApp.close();
			}}
			data-v-8899132f=""
			data-v-a174c313=""
			className="w-full text-xl font-extrabold"
		>
			<div data-v-8899132f="" className="label-center-compensator"/>
			<div data-v-8899132f="" className="label font-bold ">
				Invite a fren
			</div>
			<div data-v-8899132f="" className="right-slot">
				{/**/}
			</div>
		</button>
	);
};

export default InviteButton;
