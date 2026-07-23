import { api } from '@/services/api';
export async function getCourses(params) {
    const response = await api.get('/courses', { params });
    return response.data;
}
export async function getCourse(id) {
    const response = await api.get(`/courses/${id}`);
    return response.data?.data;
}
export async function createCourse(payload) {
    const response = await api.post('/courses', payload);
    return response.data?.data;
}
export async function updateCourse(id, payload) {
    const response = await api.put(`/courses/${id}`, payload);
    return response.data?.data;
}
export async function deleteCourse(id) {
    const response = await api.delete(`/courses/${id}`);
    return response.data?.data ?? null;
}
