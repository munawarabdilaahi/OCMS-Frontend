import { api } from '@/services/api';

export async function getAdminDashboard() {
    const response = await api.get('/dashboard/admin');
    return response.data?.data;
}

export async function getTeacherDashboard() {
    const response = await api.get('/dashboard/teacher');
    return response.data?.data;
}

export async function getStudentDashboard() {
    const response = await api.get('/dashboard/student');
    return response.data?.data;
}
