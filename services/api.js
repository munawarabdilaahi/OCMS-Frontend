import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = window.localStorage.getItem('ocms_token');
        if (token && typeof token === 'string' && token.length > 0) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message || 'Request failed';

        if (status === 401 && typeof window !== 'undefined') {
            window.localStorage.removeItem('ocms_token');
            window.localStorage.removeItem('ocms_user');
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/forgot-password' && currentPath !== '/reset-password') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(new Error(message));
    }
);
