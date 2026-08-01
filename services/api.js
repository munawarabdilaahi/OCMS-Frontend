import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let refreshPromise = null;
let redirectingToLogin = false;

async function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(`${API_BASE}/auth/refresh-token`, {}, { withCredentials: true, headers: { 'Content-Type': 'application/json' } })
            .then((response) => {
                refreshPromise = null;
                return response;
            })
            .catch((error) => {
                refreshPromise = null;
                throw error;
            });
    }
    return refreshPromise;
}

function redirectToLoginOnce() {
    if (redirectingToLogin) return;
    if (typeof window === 'undefined') return;
    redirectingToLogin = true;
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/forgot-password' && currentPath !== '/reset-password') {
        window.location.href = '/login';
    }
    setTimeout(() => {
        redirectingToLogin = false;
    }, 3000);
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status === 401 && !originalRequest._retry) {
            if (typeof window === 'undefined') {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                await refreshAccessToken();
                return api(originalRequest);
            } catch {
                redirectToLoginOnce();
                return Promise.reject(error);
            }
        }

        const message = error.response?.data?.message || error.message || 'Request failed';
        return Promise.reject(new Error(message));
    }
);
