import React from 'react';
import SendCrypto from './SendCrypto';

function SendShib() {
    return (
        <SendCrypto
            currency="SHIB"
            minAmount={300000}
            fee={30000}
            addressRegex={/^0x[a-zA-Z0-9]{40}$/}
            addressPlaceholder="Your BNB (BEP20) Address"
            network="BEP20"
        />
    );
}

export default SendShib;
