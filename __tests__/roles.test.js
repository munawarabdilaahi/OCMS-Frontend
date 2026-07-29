import { describe, it, expect } from '@jest/globals';

const { hasPermission, hasAnyPermission, getRolePermissions, ROLES, PERMISSIONS } = await import('@/lib/roles');

describe('hasPermission', () => {
    it('returns true for admin with any permission', () => {
        expect(hasPermission('Admin', 'anything')).toBe(true);
    });

    it('returns true for SuperAdmin with any permission', () => {
        expect(hasPermission('SuperAdmin', 'anything')).toBe(true);
    });

    it('returns true for teacher with own permission', () => {
        expect(hasPermission('Teacher', 'attendance:manage')).toBe(true);
    });

    it('returns false for student with manage permission', () => {
        expect(hasPermission('Student', 'students:manage')).toBe(false);
    });

    it('returns false for unknown role', () => {
        expect(hasPermission('UnknownRole', 'dashboard:view')).toBe(false);
    });
});

describe('hasAnyPermission', () => {
    it('returns true when role has any of the permissions', () => {
        expect(hasAnyPermission('Teacher', ['dashboard:view', 'students:manage'])).toBe(true);
    });

    it('returns false when role has none of the permissions', () => {
        expect(hasAnyPermission('Student', ['students:manage', 'settings:manage'])).toBe(false);
    });

    it('returns false for empty permissions array', () => {
        expect(hasAnyPermission('Admin', [])).toBe(false);
    });
});

describe('getRolePermissions', () => {
    it('returns all permission keys for admin', () => {
        const perms = getRolePermissions('Admin');
        expect(perms).toEqual(PERMISSIONS.map((p) => p.key));
    });

    it('returns specific permissions for teacher', () => {
        const perms = getRolePermissions('Teacher');
        expect(perms).toContain('dashboard:view');
        expect(perms).toContain('attendance:manage');
        expect(perms).not.toContain('students:manage');
    });

    it('returns view-only permissions for student', () => {
        const perms = getRolePermissions('Student');
        expect(perms).toContain('courses:view');
        expect(perms).not.toContain('courses:manage');
    });
});

describe('ROLES', () => {
    it('defines all expected roles', () => {
        expect(ROLES).toEqual({
            ADMIN: 'Admin',
            SUPER_ADMIN: 'SuperAdmin',
            REGISTRAR: 'Registrar',
            TEACHER: 'Teacher',
            ACCOUNTANT: 'Accountant',
            STUDENT: 'Student',
        });
    });
});
