import { api } from '@/services/api';
export async function getTeachers(params) {
    const response = await api.get('/teachers', { params });
    return response.data;
}
export async function getTeacher(id) {
    const response = await api.get(`/teachers/${id}`);
    return response.data?.data;
}
export async function createTeacher(payload) {
    const response = await api.post('/teachers', payload);
    return response.data?.data;
}
export async function updateTeacher(id, payload) {
    const response = await api.put(`/teachers/${id}`, payload);
    return response.data?.data;
}
export async function deleteTeacher(id) {
    const response = await api.delete(`/teachers/${id}`);
    return response.data?.data ?? null;
}
