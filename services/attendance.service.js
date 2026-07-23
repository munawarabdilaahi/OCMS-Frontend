import { api } from '@/services/api';
export async function getAttendance(params) {
    const response = await api.get('/attendance', { params });
    return response.data;
}
export async function getAttendanceStats(params) {
    const response = await api.get('/attendance/stats', { params });
    return response.data?.data;
}
export async function createAttendance(payload) {
    const response = await api.post('/attendance', payload);
    return response.data?.data;
}
export async function bulkCreateAttendance(payload) {
    const response = await api.post('/attendance/bulk', payload);
    return response.data?.data;
}
export async function updateAttendance(id, payload) {
    const response = await api.put(`/attendance/${id}`, payload);
    return response.data?.data;
}
export async function deleteAttendance(id) {
    const response = await api.delete(`/attendance/${id}`);
    return response.data?.data ?? null;
}
