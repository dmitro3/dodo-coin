"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { postData } from '../../utils/api';
import Big from 'big.js';
import semicircle from "../../assets/images/icon_semicircle.svg";

function isValidAddress(address, regex) {
    return regex.test(address);
}

function SendCrypto({ currency, minAmount, fee, addressRegex, addressPlaceholder, network }) {
    const { userData, loading } = useAuth();
    const [disabled, setDisabled] = useState(true);
    const [amount, setAmount] = useState(0);
    const [receiveAmount, setReceiveAmount] = useState(0);
    const [address, setAddress] = useState('');
    const [response, setResponse] = useState({});
    const [pressed, setPressed] = useState(false);
    const navigate = useRouter();

    useEffect(() => {
        if(currency) {
            let currency_tag = 'shib'
            if (currency === 'TRX') {
                currency_tag = 'tron'
            }
            const balance = userData[`${currency_tag}_balance`];
            if (Big(balance).gte(Big(amount)) && Big(amount).gte(Big(minAmount)) && isValidAddress(address, addressRegex)) {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        }
    }, [amount, address, loading, currency, minAmount, addressRegex]);

    const addressChange = (event) => {
        setAddress(event.target.value);
    };

    const amountChange = (event) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value) && value >= 0) {
            setAmount(value);
            setReceiveAmount(value >= minAmount ? value - fee : 0);
        }
    };

    const send = async () => {
        setPressed(true);
        try {
            const res = await postData('/sendCoin', {
                currency: currency.toUpperCase(),
                address: address,
                amount: amount.toString()
            });
            if (res.status === 'success') {
                navigate(0);
            }
            setResponse(res);
        } catch (error) {
            console.error('Error sending coin:', error);
            setResponse({ status: 'error', text: 'Failed to send. Please try again.' });
        }
        setPressed(false);
    };

    return (
        <div id={`send${currency}`} className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <span className="modal-title">Enter your personal {currency} address</span>
                    </div>
                    <div className="modal-body">
                        <span className="modal-info">
                            This amount will be sent to the {network} compatible wallet address
                        </span>
                        <span className="modal-minimum">
                            Minimum send amount is {minAmount} {currency}
                        </span>
                        <input
                            type="text"
                            className="modal-input__address modal-input"
                            placeholder={addressPlaceholder}
                            onChange={addressChange}
                        />
                        <input
                            type="number"
                            className="modal-input__amount modal-input"
                            placeholder="Amount"
                            onChange={amountChange}
                        />
                        <span className="modal-fee">
                            Network fee: {fee} {currency}
                        </span>
                        <span className="modal-receive">
                            Receive amount: {receiveAmount} {currency}
                        </span>
                        <span className={`modal-minimum${response.status ? ` ${response.status}` : ''}`}>
                            {response.text || ''}
                        </span>
                        <div className="modal-buttons">
                            <button
                                className={`modal-button modal-button__send button${disabled ? ' disabled' : ''}`}
                                disabled={disabled}
                                onClick={send}
                            >
                                <span>Send</span>
                                <img
                                    src={semicircle}
                                    className={`send__icon spin${pressed ? '' : ' hidden'}`}
                                    alt=""
                                />
                            </button>
                            <a className="modal-button modal-button__cancel button" href="#close">Not yet</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SendCrypto;
