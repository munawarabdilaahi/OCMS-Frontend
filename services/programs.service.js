import { api } from '@/services/api';
export async function getPrograms() {
    const response = await api.get('/programs');
    return response.data?.data || [];
}
export async function getProgram(id) {
    const response = await api.get(`/programs/${id}`);
    return response.data?.data;
}
export async function createProgram(payload) {
    const response = await api.post('/programs', payload);
    return response.data?.data;
}
export async function updateProgram(id, payload) {
    const response = await api.put(`/programs/${id}`, payload);
    return response.data?.data;
}
export async function deleteProgram(id) {
    const response = await api.delete(`/programs/${id}`);
    return response.data?.data ?? null;
}