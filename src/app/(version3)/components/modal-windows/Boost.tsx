"use client";
import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import {useAuth} from '@v3/hooks/useAuth';
import {postData} from '@v3/utils/api';
import Big from "big.js";
import semicircle from "../../assets/images/icon_semicircle.svg";
import Link from "next/link";
import {PrismaModelType} from "@backend/modules/prisma/Prisma";
import {calcProfit} from "@/noside/profit";
import {handleBoost} from "@v3/components/modal-windows/boostAction";

function Boost(props: {
	user: NonNullable<PrismaModelType<'user'>>
}) {
	let {user} = props;
	const [price, setPrice] = useState(100);
	const [want, setWant] = useState(10);
	const [disabled, setDisabled] = useState(false);
	const navigate = useRouter();
	const [sent, setSent] = useState(false);


	const handleAdd = async (e: any) => {
		e.stopPropagation();
		e.preventDefault();

		if (user.usdtBalance >= want) {
			handleBoost(want).then(()=>{
				window.location.hash = "";
				navigate.refresh();
			});
		} else {
			navigate.push(`/payment?amount=${want}`)
		}
	};

	return (
		<div id="boost" className="modal">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<span className="modal-title">Boost Mining Power</span>
					</div>
					<div className="modal-body">
						<span className="modal-info">Here you can boost your per second profit</span>
						<span
							className="modal-info">current investment profitability is {user?.perSecondsProfit} per seconds and {((user?.perSecondsProfit || 0) * 60 * 60).toFixed(2)} per hour</span>
						<br/>
						<div>
							<div >
								<p>Per Second: ${calcProfit(want) + (user?.perSecondsProfit || 0)}</p>
							</div>
							<input className={'modal-input'} placeholder={'Enter usdt amount'} value={want || ""} onChange={(e)=>setWant(+e.target.value)} type={'number'} />
						</div>
						<br/>
						<div className={'flex gap-2 items-center'}>
							<Link href="/payment"
								 className={"modal-button modal-button__send " + (disabled ? ' disabled' : '')}
								 onClick={handleAdd}
							>
								<span>Boost</span>
								<img
									src={semicircle} className={"send__icon spin" + (sent ? '' : ' hidden')}
									alt=""/>
							</Link>
							<a className="modal-button modal-button__cancel " href="#close">Back</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Boost;
