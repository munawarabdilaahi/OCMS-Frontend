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

export async function getMeRequest() {
    const response = await api.get('/auth/me');
    return response.data?.data;
}

export async function refreshAccessToken() {
    const response = await api.post('/auth/refresh-token');
    return response.data?.data;
}

export async function logoutRequest() {
    const response = await api.post('/auth/logout');
    return response.data?.data ?? null;
}

export async function generateEmailVerificationRequest() {
    const response = await api.post('/auth/verify-email/generate');
    return response.data?.data ?? null;
}

export async function verifyEmailRequest(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data?.data ?? null;
}

export async function getSessionsRequest() {
    const response = await api.get('/auth/sessions');
    return response.data?.data;
}

export async function revokeSessionRequest(sessionId) {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data?.data ?? null;
}

export async function revokeAllSessionsRequest() {
    const response = await api.delete('/auth/sessions');
    return response.data?.data ?? null;
}

export async function changePasswordRequest(payload) {
    const response = await api.post('/auth/change-password', payload);
    return response.data?.data;
}
