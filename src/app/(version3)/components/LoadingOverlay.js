import React from 'react';
import spinner from "../assets/images/spinner.png";
import trx_icon from "../assets/images/trx-icon.svg";

function LoadingOverlay() {
    return (
        <div className="loading-overlay">
            <div className="spinner"><img src={spinner} alt="" id="spinner"
                                          className="spinner__image spin"
                                          draggable="false"/><img
                src={trx_icon} className="spinner__icon" alt="" draggable="false"/></div>
            <span>Please, wait...</span>
        </div>
    );
}

export default LoadingOverlay;