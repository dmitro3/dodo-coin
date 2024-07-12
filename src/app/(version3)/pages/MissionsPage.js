"use client";
import React from 'react';
import Link from 'next/link';
import {useAuth} from '../hooks/useAuth';
import usePaginate from '../hooks/usePaginate';
import LoadingOverlay from '../components/LoadingOverlay';
import Navbar from '../components/Navbar';
import {fetchData} from '../utils/api';
import shib from '../assets/images/shib.svg';
import approve from '../assets/images/icon_approve.svg';
import banner from '../assets/images/banner1.png';
import welcome from '../assets/images/welcome.svg';
import join from '../assets/images/join.svg';
import subscribe from '../assets/images/subscribe.svg';
import invite from '../assets/images/invite.svg';
import rent from '../assets/images/rent.svg';
import missionButton from '../assets/images/mission-button.svg';

const mission_icons = {1: welcome, 2: join, 3: subscribe, 4: invite, 5: rent};

function MissionsPage() {
    const {loading: authLoading} = useAuth();
    const {data: missions, loading: dataLoading, refetch} = usePaginate("/getMissions");

    const claimMission = async (index) => {
        try {
            await fetchData(`/claimMission?progress=${index}`);
            refetch();
        } catch (error) {
            console.error('Failed to claim mission:', error);
        }
    };

    if (authLoading || dataLoading) {
        return <LoadingOverlay/>;
    }

    return (
        <div>
            <main>
                <span className="mission-title">5 missions available</span>
                <span className="mission-description">Complete the missions to get the SHIB</span>
                {missions.map(mission => (
                    <div key={mission.id}
                         className={`mission block${mission.completed && mission.claimed ? ' completed' : ''}`}>
                        <div className="mission__left">
                            <div className="mission-icon">
                                <img src={mission_icons[mission.id]} alt=""/>
                            </div>
                            <div className="mission-info">
                                <span className="mission-info__title">{mission.name}</span>
                                <div className="mission-info__reward">
                                    <img src={shib} alt="" className="coin-img"/>
                                    <span>{mission.reward.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} SHIB</span>
                                </div>
                            </div>
                        </div>
                        {!mission.completed ? (
                            <a href={mission.link} className="mission-button mission__right">
                                <img src={missionButton} alt=""/>
                            </a>
                        ) : mission.claimed ? (
                            <img src={approve} alt="" className="mission__right status-img mission__status-img"/>
                        ) : (
                            <button className="mission__right mission-button__claim button"
                                    onClick={() => claimMission(mission.id)}>
                                Claim
                            </button>
                        )}
                    </div>
                ))}
                <Link className="banner" href="/friends">
                    <img src={banner} alt=""/>
                </Link>
            </main>
            <Navbar/>
        </div>
    );
}

export default MissionsPage;