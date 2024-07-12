"use client";
import React, {useState, useEffect} from 'react';
import {useAuth} from '../hooks/useAuth';
import usePaginate from '../hooks/usePaginate';
import LoadingOverlay from '../components/LoadingOverlay';
import Navbar from '../components/Navbar';
import Balance from '../components/Balance';
import SendTron from '../components/modal-windows/SendTron';
import SendShib from '../components/modal-windows/SendShib';
import Boost from '../components/modal-windows/Boost';
import Link from "next/link";
import {useSearchParams} from "next/navigation"
import shib from '../assets/images/shib.svg';
import trx from '../assets/images/trx.svg';
import approve from '../assets/images/icon_approve.js';
import semicircle from '../assets/images/icon_semicircle.svg';

function Page() {
    const {userData, loading, setUserData, loadUserData} = useAuth();
    const params = useSearchParams();
    const {data, loading: dataLoading} = usePaginate("/getTransactions", params);
    const [pages, setPages] = useState([]);


    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    useEffect(() => {
        if (data) {
            const totalPages = data?.total || 1;
            setPages(Array.from({length: totalPages}, (_, i) => i + 1));
        }
    }, [data]);


    if (loading || dataLoading) {
        return <LoadingOverlay/>;
    }
    return (
        <div>
            <main>
                <Balance data={userData}/>
                <a className="button-boost button" href="#boost">Boost</a>

                <span className="table-title">Transaction History</span>
                <div className="table">
                    <table>
                        <thead>
                        <tr className="table__head">
                            <th>Date</th>
                            <th>Coin</th>
                            <th>Sum</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody className="transaction-table__body">
                        {data?.transactions.map(transaction => (
                            <tr className="table__row" key={transaction.id}>
                                <td>{transaction.created_at}</td>
                                <td>
                                    <img src={transaction.currency === 'SHIB' ? shib : trx} alt=""
                                         className="coin-img table__img"/>
                                </td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.type}</td>
                                <td>
                                    <img
                                        src={transaction.status === 'success' ? approve : semicircle}
                                        alt=""
                                        className={`status-img table__img${transaction.status === 'processing' ? ' spin' : ''}`}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-nav">
                    <Link href="?page=1" className="table-nav__first table-nav__button button">
                        <svg className="inline" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                             viewBox="0 0 16 16">
                            <path fill="currentColor" fillRule="evenodd"
                                  d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0"
                                  clipRule="evenodd"></path>
                        </svg>
                        <span>First</span>
                    </Link>
                    <div className="table-nav__pages">
                        {
                            pages.map(page => {
                                return (
                                    <Link to={`?page=${page.toString()}`}
                                          key={page}
                                          className={"table-nav__page table-nav__button button" + (page == params.get('page') ? ' active-page' : '')}>{page.toString()}</Link>
                                );
                            })
                        }
                    </div>
                    <Link to={`?page=${data?.total}`} href="" className="table-nav__last table-nav__button button">
                        <span>Last</span>
                        <svg className="inline" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                             viewBox="0 0 16 16">
                            <path fill="currentColor" fillRule="evenodd"
                                  d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8L6.22 5.28a.75.75 0 0 1 0-1.06"
                                  clipRule="evenodd"></path>
                        </svg>
                    </Link>
                </div>
            </main>
            <Navbar/>
            <SendTron/>
            <SendShib/>
            <Boost/>
        </div>
    );
}

function PageV2() {
    return (
        <div>
            <main>
                <div className={'relative'}>
                    <svg width="275" height="275" viewBox="0 0 275 275" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_f_1464_6497)">
                            <circle cx="137.529" cy="137.471" r="72.4143" fill="#d6cf00"></circle>
                        </g>
                        <circle cx="137" cy="138" r="63.4286" fill="white" fill-opacity="0.05"></circle>
                        <circle cx="137" cy="138" r="74" fill="white" fill-opacity="0.05"></circle>
                        <defs>
                            <filter id="filter0_f_1464_6497" x="0.0999756" y="0.0428467" width="274.857"
                                    height="274.857"
                                    filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                         result="shape"></feBlend>
                                <feGaussianBlur stdDeviation="32.5071"
                                                result="effect1_foregroundBlur_1464_6497"></feGaussianBlur>
                            </filter>
                        </defs>
                    </svg>
                    <svg width="150" height="150" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={'absolute left-0 top-0 right-0 bottom-0 m-auto'}>
                        <path
                            d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
                            fill="#d6cf00"/>
                        <path
                            d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z"
                            fill="white"/>
                    </svg>
                </div>
                <h2 className={'text-center text-2xl font-bold leading-1'}>My Wallet</h2>
            </main>
            <Navbar/>
        </div>
    )
}

export default PageV2;
