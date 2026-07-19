import { api } from '@/services/api';

export async function getFees(params = {}) {
    const response = await api.get('/fees', { params });
    return response.data?.data || [];
}

export async function getFee(id) {
    const response = await api.get(`/fees/${id}`);
    return response.data?.data;
}

export async function createFee(payload) {
    const response = await api.post('/fees', payload);
    return response.data?.data;
}

export async function updateFee(id, payload) {
    const response = await api.put(`/fees/${id}`, payload);
    return response.data?.data;
}

export async function deleteFee(id) {
    const response = await api.delete(`/fees/${id}`);
    return response.data;
}

export async function getInvoices(params = {}) {
    const response = await api.get('/invoices', { params });
    return { data: response.data?.data || [], meta: response.data?.meta };
}

export async function getInvoice(id) {
    const response = await api.get(`/invoices/${id}`);
    return response.data?.data;
}

export async function getInvoiceByNumber(invoiceNumber) {
    const response = await api.get(`/invoices/by-number/${invoiceNumber}`);
    return response.data?.data;
}

export async function createInvoice(payload) {
    const response = await api.post('/invoices', payload);
    return response.data?.data;
}

export async function updateInvoice(id, payload) {
    const response = await api.put(`/invoices/${id}`, payload);
    return response.data?.data;
}

export async function deleteInvoice(id) {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
}

export async function getInvoiceStats(params = {}) {
    const response = await api.get('/invoices/stats', { params });
    return response.data?.data;
}

export async function getPayments(params = {}) {
    const response = await api.get('/payments', { params });
    return { data: response.data?.data || [], meta: response.data?.meta };
}

export async function getPayment(id) {
    const response = await api.get(`/payments/${id}`);
    return response.data?.data;
}

export async function createPayment(payload) {
    const response = await api.post('/payments', payload);
    return response.data?.data;
}

export async function getPaymentStats(params = {}) {
    const response = await api.get('/payments/stats', { params });
    return response.data?.data;
}
