import { api } from '@/services/api';
export async function getExamSchedules(params) {
    const response = await api.get('/exams/schedules', { params });
    return response.data?.data;
}
export async function createExamSchedule(payload) {
    const response = await api.post('/exams/schedules', payload);
    return response.data?.data;
}
export async function getExamResults(params) {
    const response = await api.get('/exams/results', { params });
    return response.data?.data;
}
export async function submitExamResult(payload) {
    const response = await api.post('/exams/results', payload);
    return response.data?.data;
}
