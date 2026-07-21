export const ROLES = {
    ADMIN: 'Admin',
    SUPER_ADMIN: 'SuperAdmin',
    REGISTRAR: 'Registrar',
    TEACHER: 'Teacher',
    ACCOUNTANT: 'Accountant',
    STUDENT: 'Student',
};
export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: ['*'],
    [ROLES.SUPER_ADMIN]: ['*'],
    [ROLES.REGISTRAR]: ['dashboard:view', 'students:manage', 'courses:manage'],
    [ROLES.TEACHER]: ['dashboard:view', 'attendance:manage', 'results:manage'],
    [ROLES.ACCOUNTANT]: ['dashboard:view', 'payments:manage'],
    [ROLES.STUDENT]: ['dashboard:view', 'courses:view', 'attendance:view', 'results:view', 'payments:view'],
};
export const PERMISSIONS = [
    {
        key: 'dashboard:view',
        label: 'View Dashboard',
        module: 'Dashboard',
        description: 'Open the main OCMS dashboard.',
    },
    {
        key: 'students:manage',
        label: 'Manage Students',
        module: 'Students',
        description: 'Create, update, delete, and view student records.',
    },
    {
        key: 'courses:manage',
        label: 'Manage Courses',
        module: 'Courses',
        description: 'Create, update, delete, and view course records.',
    },
    {
        key: 'courses:view',
        label: 'View Courses',
        module: 'Courses',
        description: 'View course catalog and course details.',
    },
    {
        key: 'attendance:manage',
        label: 'Manage Attendance',
        module: 'Attendance',
        description: 'Take attendance and review attendance reports.',
    },
    {
        key: 'attendance:view',
        label: 'View Attendance',
        module: 'Attendance',
        description: 'View attendance records without changing them.',
    },
    {
        key: 'results:manage',
        label: 'Manage Results',
        module: 'Results',
        description: 'Review and manage student result records.',
    },
    {
        key: 'results:view',
        label: 'View Results',
        module: 'Results',
        description: 'View published academic results.',
    },
    {
        key: 'payments:manage',
        label: 'Manage Payments',
        module: 'Payments',
        description: 'Review payments, invoices, and finance details.',
    },
    {
        key: 'payments:view',
        label: 'View Payments',
        module: 'Payments',
        description: 'View personal payment and invoice records.',
    },
    {
        key: 'settings:manage',
        label: 'Manage Settings',
        module: 'Settings',
        description: 'Manage users, roles, and permissions.',
    },
];
export const ROLE_DESCRIPTIONS = {
    [ROLES.ADMIN]: 'Full access across OCMS modules, settings, users, and permissions.',
    [ROLES.SUPER_ADMIN]: 'Full access across OCMS modules, settings, users, and permissions.',
    [ROLES.REGISTRAR]: 'Manages student records and academic course records.',
    [ROLES.TEACHER]: 'Manages attendance and academic result workflows.',
    [ROLES.ACCOUNTANT]: 'Manages payment records, invoices, and finance dashboards.',
    [ROLES.STUDENT]: 'View-only access to student-facing academic and finance records.',
};
export const roleOptions = Object.values(ROLES);
export function hasPermission(role, permission) {
    const permissions = ROLE_PERMISSIONS[role] ?? [];
    return permissions.includes('*') || permissions.includes(permission);
}
export function hasAnyPermission(role, permissions = []) {
    return permissions.some((permission) => hasPermission(role, permission));
}
export function getRolePermissions(role) {
    const permissions = ROLE_PERMISSIONS[role] ?? [];
    if (permissions.includes('*')) {
        return PERMISSIONS.map((permission) => permission.key);
    }
    return permissions;
}
