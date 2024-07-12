"use client";
import React, {useEffect, useState} from 'react';
import {Link} from "next/link";
import {useSearchParams} from "next/navigation";
import {useAuth} from '../hooks/useAuth';
import usePaginate from '../hooks/usePaginate';
import LoadingOverlay from '../components/LoadingOverlay';
import Navbar from '../components/Navbar';
import shib from '../assets/images/shib.svg';
import trx from '../assets/images/trx.svg';
import Image from "next/image";

function FriendsPage() {
    const {userData, loading: authLoading} = useAuth();
    const searchParams = useSearchParams();
    const {data, loading: dataLoading} = usePaginate("/getFriends", searchParams);
    const [refLink, setRefLink] = useState('');
    const [pages, setPages] = useState([]);

    useEffect(() => {
        if (data) {
            const totalPages = data.total || 1;
            setPages(Array.from({length: totalPages}, (_, i) => i + 1));
        }
    }, [data]);

    useEffect(() => {
        if (userData) {
            setRefLink(`https://t.me/lumitronapp_bot?start=${userData.user.id.toString()}`);
        }
    }, [userData]);

    if (authLoading || dataLoading) {
        return <LoadingOverlay/>;
    }

    return (
        <div>
            <main>
                <div className="ref-info block">
                    Invite friends and receive 500 SHIB for every friend registration. You can also receive bonuses for
                    completed missions by your friends.
                </div>
                <div className="invite-link block">
                    <span className="invite-link__title">Your Invite Link</span>
                    <a className="invite-link__copy" onClick={() => {
                        navigator.clipboard.writeText(refLink)
                    }}>
                        <span className="link">{refLink}</span>
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
                <div className="inviter block">
                    <span className="inviter__title">Your inviter</span>
                    <span className="inviter__username">{data?.inviter ? data.inviter : 'No inviter'}</span>
                </div>

                <div className="table">
                    <table>
                        <thead>
                        <tr className="table__head">
                            <th>Name</th>
                            <th>Missions</th>
                            <th>Rewards</th>
                            <th>Bonus</th>
                        </tr>
                        </thead>
                        <tbody className="table__body">
                        {data?.friends.map(friend => {
                            return (
                                <tr key={friend.id} className="table__row">
                                    <td id="username">
                                        {friend.username.length > 8 ? (friend.username.substring(0, 8) + '...') : friend.username}
                                    </td>
                                    <td>{friend?.missions || ""} of 5</td>
                                    <td className="table__row-coin"><Image src={trx} alt=""
                                                                         className="coin-img table__img"/><span>{friend.rewards}</span>
                                    </td>
                                    <td className="table__row-coin"><Image src={shib} alt=""
                                                                         className="coin-img table__img"/><span>{friend.bonus}</span>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                
            </main>
            <Navbar/>
        </div>
    );
}

export default FriendsPage;
