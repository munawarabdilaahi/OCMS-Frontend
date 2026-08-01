import { api } from '@/services/api';

export async function getUniversities(params = {}) {
    const response = await api.get('/universities', { params });
    return response.data?.data || [];
}

export async function getUniversity(id) {
    const response = await api.get(`/universities/${id}`);
    return response.data?.data;
}

export async function getUniversityStats(id) {
    const response = await api.get(`/universities/${id}/stats`);
    return response.data?.data;
}

export async function createUniversity(payload) {
    const response = await api.post('/universities', payload);
    return response.data?.data;
}

export async function updateUniversity(id, payload) {
    const response = await api.put(`/universities/${id}`, payload);
    return response.data?.data;
}

export async function deleteUniversity(id) {
    const response = await api.delete(`/universities/${id}`);
    return response.data?.data ?? null;
}
