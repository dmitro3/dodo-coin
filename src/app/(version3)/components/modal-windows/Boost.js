"use client";
import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import {useAuth} from '../../hooks/useAuth';
import {postData} from '../../utils/api';
import Big from "big.js";
import semicircle from "../../assets/images/icon_semicircle.svg";
import Link from "next/link";

function Boost() {
    const [price, setPrice] = useState(100);
    const [text, setText] = useState(100);
    const [disabled, setDisabled] = useState(false);
    const [displayText, setDisplayText] = useState('1.0 GH/s');
    const navigate = useRouter();
    const [sended, setSended] = useState(false);
    const {userData} = useAuth();

    const handleInputChange = (event) => {
        const value = event.target.value.trim();

        if (value === '') {
            setText(value);
            setPrice(0);
            setDisabled(true);
            setDisplayText('1.0 GH/s');
        } else {
            const absValue = Math.abs(value);
            setText(absValue);
            setPrice(absValue);
            setDisabled(absValue < 100);

            const power = Big(absValue).div(10);
            setDisplayText(power >= 1000 ? `${power.div(1000).toFixed(1)} TH/s` : `${power.toFixed(1)} GH/s`);
        }
    }

    const handleAdd = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        let response;
        try {
            setSended(true);
            response = await postData('/create_boost', {amount: price.toString()});
        } catch (error) {
            console.error('Error creating boost:', error);
        } finally {
            setSended(false);

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
                            className="modal-info">The investment profitability is 5% per day and 150% for 30 days.</span>
                        <div className="modal-calc">
                            <span className="modal-calc__power">⚡ {displayText}</span>
                            <span
                                className="modal-calc__total">Total Profit: ~{Big(price).times(1.5).toFixed(2)} TRX</span>
                            <span
                                className="modal-calc__total">Daily Profit: ~{Big(price).times(0.05).toFixed(2)} TRX</span>
                        </div>
                        <input type="number" value={text} className="modal-input__amount modal-input"
                               placeholder="Amount" onChange={handleInputChange}/>
                        <span className="modal-minimum-boost">Minimum amount: 100 TRX</span>
                        <br/>
                        <div className={'flex gap-2 items-center'}>
                            <Link href="/payment"
                                    className={"modal-button modal-button__send " + (disabled ? ' disabled' : '')}
                                    disabled={disabled} onClick={handleAdd}><span>Add</span> <img
                                src={semicircle} className={"send__icon spin" + (sended ? '' : ' hidden')} alt=""/>
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
