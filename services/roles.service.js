import { api } from '@/services/api';
export async function getRoles() {
    const response = await api.get('/roles');
    return response.data?.data;
}
export async function getRole(id) {
    const response = await api.get(`/roles/${id}`);
    return response.data?.data;
}
export async function createRole(payload) {
    const response = await api.post('/roles', payload);
    return response.data?.data;
}
export async function updateRole(id, payload) {
    const response = await api.put(`/roles/${id}`, payload);
    return response.data?.data;
}
export async function deleteRole(id) {
    const response = await api.delete(`/roles/${id}`);
    return response.data?.data ?? null;
}
