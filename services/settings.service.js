import { api } from '@/services/api';

export async function getProfile() {
    const response = await api.get('/settings/profile');
    return response.data?.data;
}

export async function updateProfile(data) {
    const response = await api.put('/settings/profile', data);
    return response.data?.data;
}

export async function getPreferences() {
    const response = await api.get('/settings/preferences');
    return response.data?.data;
}

export async function updatePreferences(data) {
    const response = await api.put('/settings/preferences', data);
    return response.data?.data;
}

export async function getInstitutionSettings() {
    const response = await api.get('/settings/institution');
    return response.data?.data;
}

export async function updateInstitutionSettings(data) {
    const response = await api.put('/settings/institution', data);
    return response.data?.data;
}
