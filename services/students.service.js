import { api } from '@/services/api';
export async function getStudents(params) {
    const response = await api.get('/students', { params });
    return response.data;
}
export async function getStudent(id) {
    const response = await api.get(`/students/${id}`);
    return response.data?.data;
}
export async function createStudent(payload) {
    const response = await api.post('/students', payload);
    return response.data?.data;
}
export async function updateStudent(id, payload) {
    const response = await api.put(`/students/${id}`, payload);
    return response.data?.data;
}
export async function deleteStudent(id) {
    const response = await api.delete(`/students/${id}`);
    return response.data?.data;
}
