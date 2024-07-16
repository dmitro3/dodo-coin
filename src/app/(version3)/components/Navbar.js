import React from 'react';
import Link from 'next/link';
import icon1 from '../assets/images/icon_1_green.svg';
import icon2 from '../assets/images/icon_2_green.svg';
import icon3 from '../assets/images/icon_3_green.svg';
import icon4 from '../assets/images/icon_4_green.svg';
import Image from "next/image";

function Navbar() {
    return (
        <div>
            <nav className={'pb-4'}>
                <div className="nav-links">
                    <Link className="nav-links__link" href="/">
                        <Image src={icon1} alt=""/>
                        <span>Home</span>
                    </Link>
                    <Link className="nav-links__link" href="/wallet">
                        <Image src={icon2} alt=""/>
                        <span>Wallet</span>
                    </Link>
                    <Link className="nav-links__link" href="/friends">
                        <Image src={icon3} alt=""/>
                        <span>Friends</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
