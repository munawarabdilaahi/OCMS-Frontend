import { api } from '@/services/api';

export async function getFaculties(params = {}) {
    const response = await api.get('/faculties', { params });
    return response.data?.data || [];
}

export async function getFaculty(id) {
    const response = await api.get(`/faculties/${id}`);
    return response.data?.data;
}

export async function getFacultyStats(id) {
    const response = await api.get(`/faculties/${id}/stats`);
    return response.data?.data;
}

export async function createFaculty(payload) {
    const response = await api.post('/faculties', payload);
    return response.data?.data;
}

export async function updateFaculty(id, payload) {
    const response = await api.put(`/faculties/${id}`, payload);
    return response.data?.data;
}

export async function deleteFaculty(id) {
    const response = await api.delete(`/faculties/${id}`);
    return response.data?.data ?? null;
}