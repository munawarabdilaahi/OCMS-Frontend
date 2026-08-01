import { api } from '@/services/api';
export async function getLevels() {
    const response = await api.get('/levels');
    return response.data?.data || [];
}
export async function getLevel(id) {
    const response = await api.get(`/levels/${id}`);
    return response.data?.data;
}
export async function createLevel(payload) {
    const response = await api.post('/levels', payload);
    return response.data?.data;
}
export async function updateLevel(id, payload) {
    const response = await api.put(`/levels/${id}`, payload);
    return response.data?.data;
}
export async function deleteLevel(id) {
    const response = await api.delete(`/levels/${id}`);
    return response.data?.data ?? null;
}