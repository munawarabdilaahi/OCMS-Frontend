export const paymentStatuses = ['COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'];
export const paymentMethods = ['Bank Transfer', 'Mobile Money', 'Card', 'Cash', 'Scholarship'];

export function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatDate(value) {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}
