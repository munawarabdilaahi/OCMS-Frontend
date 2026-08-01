import { api } from '@/services/api';
export async function getAcademicYears() {
    const response = await api.get('/academic-years');
    return response.data?.data || [];
}
export async function getAcademicYear(id) {
    const response = await api.get(`/academic-years/${id}`);
    return response.data?.data;
}
export async function createAcademicYear(payload) {
    const response = await api.post('/academic-years', payload);
    return response.data?.data;
}
export async function updateAcademicYear(id, payload) {
    const response = await api.put(`/academic-years/${id}`, payload);
    return response.data?.data;
}
export async function deleteAcademicYear(id) {
    const response = await api.delete(`/academic-years/${id}`);
    return response.data?.data ?? null;
}