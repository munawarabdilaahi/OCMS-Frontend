import { api } from '@/services/api';
export async function loginRequest(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data?.data;
}
export async function registerRequest(payload) {
    const response = await api.post('/auth/register', payload);
    return response.data?.data;
}
export async function forgotPasswordRequest(payload) {
    const response = await api.post('/auth/forgot-password', payload);
    return response.data?.data;
}
export async function resetPasswordRequest(payload) {
    const response = await api.post('/auth/reset-password', payload);
    return response.data?.data;
}
