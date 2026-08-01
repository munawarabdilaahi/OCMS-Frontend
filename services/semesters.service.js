import { api } from '@/services/api';
export async function getSemesters() {
    const response = await api.get('/semesters');
    return response.data?.data || [];
}
export async function getSemester(id) {
    const response = await api.get(`/semesters/${id}`);
    return response.data?.data;
}
export async function createSemester(payload) {
    const response = await api.post('/semesters', payload);
    return response.data?.data;
}
export async function updateSemester(id, payload) {
    const response = await api.put(`/semesters/${id}`, payload);
    return response.data?.data;
}
export async function deleteSemester(id) {
    const response = await api.delete(`/semesters/${id}`);
    return response.data?.data ?? null;
}