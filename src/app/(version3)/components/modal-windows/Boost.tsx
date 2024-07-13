"use client";
import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import {useAuth} from '@v3/hooks/useAuth';
import {postData} from '@v3/utils/api';
import Big from "big.js";
import semicircle from "../../assets/images/icon_semicircle.svg";
import Link from "next/link";
import {PrismaModelType} from "@backend/modules/prisma/Prisma";

function Boost(props: {
	user: PrismaModelType<'user'>
}) {
	let {user} = props;
	const [price, setPrice] = useState(100);
	const [want, setWant] = useState(10);
	const [disabled, setDisabled] = useState(false);
	const [displayText, setDisplayText] = useState('1.0 GH/s');
	const navigate = useRouter();
	const [sent, setSent] = useState(false);
	const {userData} = useAuth();

	const handleInputChange = (event: any) => {
		const value = event.target.value.trim();

		if (value === '') {
			setWant(value);
			setPrice(0);
			setDisabled(true);
			setDisplayText('1.0 GH/s');
		} else {
			const absValue = Math.abs(value);
			setWant(absValue);
			setPrice(absValue);
			setDisabled(absValue < 100);

			const power = Big(absValue).div(10);
			// @ts-ignore
			setDisplayText(power >= 1000 ? `${power.div(1000).toFixed(1)} TH/s` : `${power.toFixed(1)} GH/s`);
		}
	}

	const handleAdd = async (e: any) => {
		e.stopPropagation();
		e.preventDefault();
		let response;
		try {
			setSent(true);
			response = await postData('/create_boost', {amount: price.toString()});
		} catch (error) {
			console.error('Error creating boost:', error);
		} finally {
			setSent(false);

			navigate.push(`/payment?amount=${price}`);

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
								<p>Per Second: ${0.002 * (want / 1.5) + (user?.perSecondsProfit || 0)}</p>
							</div>
							<input className={'modal-input'} placeholder={'Enter usdt amount'} value={want} onChange={(e)=>setWant(+e.target.value)} type={'number'} />
						</div>
						<br/>
						<div className={'flex gap-2 items-center'}>
							<Link href="/payment"
								 className={"modal-button modal-button__send " + (disabled ? ' disabled' : '')}
								 onClick={handleAdd}
							>
								<span>Add</span>
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
