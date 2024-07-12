import React from 'react';
import SendCrypto from './SendCrypto';

function SendTron() {
    return (
        <SendCrypto
            currency="TRX"
            minAmount={20}
            fee={2.5}
            addressRegex={/^T[a-zA-Z0-9]{33}$/}
            addressPlaceholder="Your TRX (TRC20) Address"
            network="TRC20"
        />
    );
}

export default SendTron;
