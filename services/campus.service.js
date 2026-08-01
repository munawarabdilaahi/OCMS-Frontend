import { api } from '@/services/api';

export async function getCampuses(params = {}) {
    const response = await api.get('/campuses', { params });
    return response.data?.data || [];
}

export async function getCampus(id) {
    const response = await api.get(`/campuses/${id}`);
    return response.data?.data;
}

export async function getCampusStats(id) {
    const response = await api.get(`/campuses/${id}/stats`);
    return response.data?.data;
}

export async function createCampus(payload) {
    const response = await api.post('/campuses', payload);
    return response.data?.data;
}

export async function updateCampus(id, payload) {
    const response = await api.put(`/campuses/${id}`, payload);
    return response.data?.data;
}

export async function deleteCampus(id) {
    const response = await api.delete(`/campuses/${id}`);
    return response.data?.data ?? null;
}