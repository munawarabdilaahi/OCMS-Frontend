export const ORG_STATUS_STYLES = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-muted text-muted-foreground',
    SUSPENDED: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    CLOSED: 'bg-red-500/10 text-red-700 dark:text-red-300',
};

export const STUDENT_STATUS_STYLES = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    SUSPENDED: 'bg-destructive/10 text-destructive',
    GRADUATED: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    WITHDRAWN: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    DELETED: 'bg-muted text-muted-foreground',
};

export const TEACHER_STATUS_STYLES = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    DELETED: 'bg-destructive/10 text-destructive',
};

export const COURSE_STATUS_STYLES = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-muted text-muted-foreground',
};

export const PAYMENT_STATUS_STYLES = {
    COMPLETED: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    PENDING: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    FAILED: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    REFUNDED: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
};

export const INVOICE_STATUS_STYLES = {
    PAID: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    PENDING: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    PARTIAL: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    OVERDUE: 'bg-destructive/10 text-destructive',
    CANCELLED: 'bg-muted text-muted-foreground',
    REFUNDED: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
};

export const ATTENDANCE_STATUS_STYLES = {
    PRESENT: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    ABSENT: 'bg-destructive/10 text-destructive',
    LATE: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
};

export const EXAM_STATUS_STYLES = {
    SCHEDULED: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    IN_PROGRESS: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    COMPLETED: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    CANCELLED: 'bg-destructive/10 text-destructive',
};

export const ACTIVITY_STATUS_STYLES = {
    Completed: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    'In Progress': 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Review: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
};

export function getStatusStyle(status, styles = ORG_STATUS_STYLES) {
    return styles[status] || 'bg-muted text-muted-foreground';
}
