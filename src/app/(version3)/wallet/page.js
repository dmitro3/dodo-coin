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

export default Page;
