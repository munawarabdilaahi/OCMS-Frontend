import { api } from '@/services/api';

export async function getDepartments(params = {}) {
    const response = await api.get('/departments', { params });
    return response.data?.data || [];
}

export async function getDepartmentsWithMeta(params = {}) {
    const response = await api.get('/departments', { params });
    return { data: response.data?.data || [], meta: response.data?.meta || {} };
}

export async function getDepartment(id) {
    const response = await api.get(`/departments/${id}`);
    return response.data?.data;
}

export async function createDepartment(payload) {
    const response = await api.post('/departments', payload);
    return response.data?.data;
}

export async function updateDepartment(id, payload) {
    const response = await api.put(`/departments/${id}`, payload);
    return response.data?.data;
}

export async function deleteDepartment(id) {
    const response = await api.delete(`/departments/${id}`);
    return response.data?.data ?? null;
}

export async function getDepartmentStats(id) {
    const response = await api.get(`/departments/${id}/stats`);
    return response.data?.data;
}
