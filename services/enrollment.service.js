import { api } from '@/services/api';

export async function getEnrollments(params) {
    const response = await api.get('/enrollments', { params });
    return response.data;
}

export async function createEnrollment(payload) {
    const response = await api.post('/enrollments', payload);
    return response.data?.data;
}

export async function deleteEnrollment(id) {
    const response = await api.delete(`/enrollments/${id}`);
    return response.data?.data ?? null;
}
