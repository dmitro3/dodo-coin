import React from 'react';
import Link from 'next/link';
import icon1 from '../assets/images/icon_1_green.svg';
import icon2 from '../assets/images/icon_2_green.svg';
import icon3 from '../assets/images/icon_3_green.svg';
import icon4 from '../assets/images/icon_4_green.svg';

function Navbar() {
    return (
        <nav>
            <div className="nav-links">
                <Link className="nav-links__link" href="/">
                    <img src={icon1} alt=""/>
                    <span>Home</span>
                </Link>
                <Link className="nav-links__link" href="/wallet">
                    <img src={icon2} alt=""/>
                    <span>Wallet</span>
                </Link>
                <Link className="nav-links__link" href="/friends">
                    <img src={icon3} alt=""/>
                    <span>Friends</span>
                </Link>
                <Link className="nav-links__link" href="/missions">
                    <img src={icon4} alt=""/>
                    <span>Missions</span>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
