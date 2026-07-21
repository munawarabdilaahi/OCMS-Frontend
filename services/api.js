import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token) {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
}

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
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status === 401 && !originalRequest._retry) {
            if (typeof window === 'undefined') {
                return Promise.reject(error);
            }

            const refreshToken = window.localStorage.getItem('ocms_refresh_token');

            if (!refreshToken) {
                window.localStorage.removeItem('ocms_token');
                window.localStorage.removeItem('ocms_user');
                window.localStorage.removeItem('ocms_refresh_token');
                const currentPath = window.location.pathname;
                if (currentPath !== '/login' && currentPath !== '/forgot-password' && currentPath !== '/reset-password') {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
                    { refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const { token: newToken, refreshToken: newRefreshToken } = response.data?.data || {};

                if (newToken) {
                    window.localStorage.setItem('ocms_token', newToken);
                    if (newRefreshToken) {
                        window.localStorage.setItem('ocms_refresh_token', newRefreshToken);
                    }
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    return api(originalRequest);
                }

                throw new Error('No token in refresh response');
            } catch (refreshError) {
                processQueue(refreshError, null);
                window.localStorage.removeItem('ocms_token');
                window.localStorage.removeItem('ocms_user');
                window.localStorage.removeItem('ocms_refresh_token');
                const currentPath = window.location.pathname;
                if (currentPath !== '/login' && currentPath !== '/forgot-password' && currentPath !== '/reset-password') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        const message = error.response?.data?.message || error.message || 'Request failed';
        return Promise.reject(new Error(message));
    }
);
