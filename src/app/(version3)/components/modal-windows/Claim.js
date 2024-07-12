"use client";
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '../../hooks/useAuth';
import {postData} from '../../utils/api';
import semicircle from '../../assets/images/icon_semicircle.svg';

function Claim() {
    const [claimed, setClaimed] = useState(false);
    const [response, setResponse] = useState({});
    const navigate = useRouter();
    const {userData} = useAuth();

    const claim = async () => {
        setClaimed(true);
        try {
            const res = await postData('/claimTrx');
            if (res.status === 'success') {
                navigate(0);
            }
            setResponse(res);
        } catch (error) {
            console.error('Error claiming TRX:', error);
            setResponse({status: 'failed', text: 'Failed to claim. Please try again.'});
        }
        setClaimed(false);
    };

    const clearResponse = () => {
        setResponse({});
    };

    return (
        <div id="claim" className="modal">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <span className="modal-title">Claim TRX to Wallet balance</span>
                    </div>
                    <div className="modal-body">
                        <span className="modal-info">Once claimed, the mined TRX wil be deducted from your mining balance and will be credited to your wallet balance.</span>
                        <span className="modal-minimum">Minimum claim amount is 1 TRX</span>
                        <span
                            className={"modal-minimum" + (response !== {} ? ` ${response.status}` : '')}>{response != null ? response.text : ''}</span>
                        <div className="modal-buttons">
                            <button className="modal-button modal-button__send button" onClick={claim}>
                                <span>Claim</span> <img
                                src={semicircle} className={"send__icon spin" + (claimed ? '' : ' hidden')} alt=""/>
                            </button>
                            <a className="modal-button modal-button__cancel button" href="#close"
                               onClick={clearResponse}>Not yet</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Claim;
