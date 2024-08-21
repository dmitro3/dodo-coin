'use client'




import {sendInvite} from "@backend/api/player/send_invite/actions";
import {__PAGE_LOAD} from "@/old/@special/PageLoader";

const InviteButton = () => {
	return (
		<button
			onClick={async ()=>{
				__PAGE_LOAD(true);
				await sendInvite()
				///@ts-ignore
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
