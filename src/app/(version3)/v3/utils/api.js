import axios from 'axios';

const api = axios.create({
    baseURL: '/v/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authenticate = async () => {
    const initData = window.Telegram.WebApp.initData;
    const response = await api.get('/me', {
        headers: {
            Authorization: `Bearer ${initData}`,
        },
    });
    return response.data;
};

export const fetchData = async (url, params = {}) => {
    const initData = window.Telegram.WebApp.initData;
    const response = await api.get(url, {
        params,
        headers: {
            Authorization: `Bearer ${initData}`,
        },
    });
    return response.data;
};

export const postData = async (url, data = {}) => {
    const initData = window.Telegram.WebApp.initData;
    const response = await api.post(url, data, {
        headers: {
            Authorization: `Bearer ${initData}`,
        },
    });
    return response.data;
};