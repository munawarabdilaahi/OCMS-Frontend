import axios from 'axios';

export const api = axios.create({
    // Waxaan ku qornay IP-gaaga rasmiga ah halkii ay ka ahaan lahayd localhost
    baseURL: 'http://192.168.100.88:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = window.localStorage.getItem('ocms_token');
        if (token)
            config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use((response) => response, (error) => {
    const message = error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
});