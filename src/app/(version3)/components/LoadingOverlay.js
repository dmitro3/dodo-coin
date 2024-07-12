import React from 'react';
import spinner from "../assets/images/spinner.png";
import trx_icon from "../assets/images/trx-icon.svg";
import Image from "next/image";

function LoadingOverlay() {
    return (
        <div className="loading-overlay">
            <div className="spinner"><Image width={500} height={500} src={spinner} alt="" id="spinner"
                                          className="spinner__image"
                                          draggable="false"/></div>
            <span>Please, wait...</span>
        </div>
    );
}

export default LoadingOverlay;
