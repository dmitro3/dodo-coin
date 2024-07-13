"use client";
import React, {useEffect, useState} from 'react';
import {useAuth} from '../hooks/useAuth';
import LoadingOverlay from '../components/LoadingOverlay';
import Navbar from '../components/Navbar';
import semicircle from '../assets/images/icon_semicircle.svg';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {checkPosPayment, createPosPayment} from "../../../backend/crypto/CryptoPlus";
import {useInit} from "../../../utils/safeState";

function PaymentPage(props) {
    const {loading: authLoading} = useAuth();
    const [price, setPrice] = useState(0);
    const [address, setAddress] = useState('');
    const [transactionId, setTransactionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(true)
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams()

    useInit(() => {
        if (params.has("amount")) {
            const amount = params.get('amount');
            createPosPayment(+amount).then(r => {
                if (r.status === "success") {
                    setAddress(r.result.address);
                    setPrice(r.result.amount);
                    setCreating(false);
                    setTransactionId((r.result.invoice_id || r.result.uuid).split("-")?.at?.(-1))
                }
            })
        } else router.back();
    }, [pathname]);

    useEffect(() => {
        if (transactionId) {
            const checkPayment = async () => {
                setLoading(true);
                try {
                    const response = await checkPosPayment(transactionId);
                    console.log(response);
                    if (response.includes("cancel") || response.includes("paid")) {
                        router.push("/");
                    }
                } catch (error) {
                    console.error('Error checking payment:', error);
                } finally {
                    setLoading(false);
                }
            };

            const interval = setInterval(checkPayment, 15000);
            return () => clearInterval(interval);
        }
    }, [transactionId]);

    if (authLoading || creating) {
        return <LoadingOverlay/>;
    }

    const showAddress = () => {
        document.querySelectorAll('.blur').forEach(el => el.classList.remove('blur'));
        document.getElementById('show').style.display = 'none';
    };

    return (
        <div>
            <main className={'flex flex-col gap-5'}>
                <div className="payment">
                    <span className="payment__title">Payment</span>
                    <div className="payment-body">
                <span className="payment__description">
                    Please ensure that you are sending only TETHER (ERC20) to the provided deposit address. Sending any other type of cryptocurrency or asset to this address will result in a loss of those funds, as they cannot be recovered.
                </span>
                        <div className="qr">
                            <img
                                src={"https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + address}
                                alt="" className="payment-img blur"/>
                            <button className="payment__show-button button" id="show" onClick={showAddress}>
                                <span>Show Address</span>
                                <img src={semicircle} className={`show__icon spin${loading ? '' : ' hidden'}`} alt=""/>
                            </button>
                        </div>
                        <div className="payment__sum"><span className="payment__value">{price.toString()}</span> USDT <sup className={'text-xs'}>(ERC20)</sup>
                        </div>
                        <span className="payment__tip">Send {price.toString()} USDT to this address:</span>
                        <a className="invite-link__copy blur"
                           onClick={() => {
                               navigator.clipboard.writeText(address)
                           }}>
                            <span className="link">{address}</span>
                            <svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                 viewBox="0 0 24 24">
                                <g fill="none" stroke="currentColor" strokeWidth="2">
                                    <path
                                        d="M14 7c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C12.398 4 11.932 4 11 4H8c-1.886 0-2.828 0-3.414.586C4 5.172 4 6.114 4 8v3c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C5.602 14 6.068 14 7 14"></path>
                                    <rect width="10" height="10" x="10" y="10" rx="2"></rect>
                                </g>
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="awaiting">
                    <div className="awaiting__header">
                        <span className="awaiting__title">Awaiting Payment</span>
                        <img src={semicircle} alt="" className="awaiting__icon spin"/>
                    </div>
                    <span className="awaiting__note awaiting__description">
                Please note that the procedure for confirming a deposit takes 15 minutes on average.
            </span>
                    <span className="awaiting__warning awaiting__description">
                If the amount sent by you is less than the minimum amount for a deposit with this payment system, then such a payment will be considered as a donation.
            </span>
                </div>
            </main>
            <Navbar/>
        </div>
    );
}

export default PaymentPage;
