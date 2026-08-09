import { describe, it, expect } from '@jest/globals';

const {
    hasPermission,
    hasAnyPermission,
    getRolePermissions,
    normalizePermissions,
    resolvePermissions,
    ROLES,
    ROLE_PERMISSIONS,
    PERMISSIONS,
} = await import('@/lib/roles');

const CANONICAL_KEYS = [
    'dashboard:view',
    'students:view',
    'students:manage',
    'courses:view',
    'courses:manage',
    'attendance:view',
    'attendance:manage',
    'results:view',
    'results:manage',
    'payments:view',
    'payments:manage',
    'settings:manage',
];

describe('Permission catalog', () => {
    it('contains exactly the 12 canonical backend permission keys', () => {
        const keys = PERMISSIONS.map((p) => p.key).sort();
        expect(keys).toEqual([...CANONICAL_KEYS].sort());
    });

    it('has no duplicate keys', () => {
        const keys = PERMISSIONS.map((p) => p.key);
        expect(new Set(keys).size).toBe(keys.length);
    });
});

describe('Role defaults mirror backend', () => {
    it('Admin has wildcard', () => {
        expect(ROLE_PERMISSIONS[ROLES.ADMIN]).toEqual(['*']);
    });

    it('SuperAdmin has wildcard', () => {
        expect(ROLE_PERMISSIONS[ROLES.SUPER_ADMIN]).toEqual(['*']);
    });

    it('Registrar matches backend defaults', () => {
        expect(ROLE_PERMISSIONS[ROLES.REGISTRAR]).toEqual(['dashboard:view', 'students:manage', 'courses:manage', 'courses:view']);
    });

    it('Teacher matches backend defaults', () => {
        expect(ROLE_PERMISSIONS[ROLES.TEACHER]).toEqual(['dashboard:view', 'courses:view', 'attendance:manage', 'attendance:view', 'results:manage', 'results:view']);
    });

    it('Accountant matches backend defaults', () => {
        expect(ROLE_PERMISSIONS[ROLES.ACCOUNTANT]).toEqual(['dashboard:view', 'payments:manage', 'payments:view']);
    });

    it('Student matches backend defaults', () => {
        expect(ROLE_PERMISSIONS[ROLES.STUDENT]).toEqual(['dashboard:view', 'students:view', 'courses:view', 'attendance:view', 'results:view', 'payments:view']);
    });

    it('defines all six canonical roles', () => {
        expect(Object.keys(ROLE_PERMISSIONS)).toEqual(['Admin', 'SuperAdmin', 'Registrar', 'Teacher', 'Accountant', 'Student']);
    });
});

describe('hasPermission', () => {
    it('returns true for admin with any permission', () => {
        expect(hasPermission('Admin', 'anything')).toBe(true);
    });

    it('returns true for SuperAdmin with any permission', () => {
        expect(hasPermission('SuperAdmin', 'anything')).toBe(true);
    });

    it('returns true for a wildcard permission set', () => {
        expect(hasPermission(['*'], 'anything')).toBe(true);
    });

    it('returns true for exact permission match', () => {
        expect(hasPermission(['courses:manage'], 'courses:manage')).toBe(true);
        expect(hasPermission(['courses:view'], 'courses:view')).toBe(true);
    });

    it('grants view when role has the corresponding manage permission', () => {
        expect(hasPermission(['courses:manage'], 'courses:view')).toBe(true);
        expect(hasPermission(['students:manage'], 'students:view')).toBe(true);
        expect(hasPermission(['attendance:manage'], 'attendance:view')).toBe(true);
        expect(hasPermission(['results:manage'], 'results:view')).toBe(true);
        expect(hasPermission(['payments:manage'], 'payments:view')).toBe(true);
    });

    it('does not grant manage from a view permission', () => {
        expect(hasPermission(['courses:view'], 'courses:manage')).toBe(false);
        expect(hasPermission(['students:view'], 'students:manage')).toBe(false);
        expect(hasPermission(['attendance:view'], 'attendance:manage')).toBe(false);
        expect(hasPermission(['results:view'], 'results:manage')).toBe(false);
        expect(hasPermission(['payments:view'], 'payments:manage')).toBe(false);
    });

    it('does not grant unrelated permissions', () => {
        expect(hasPermission(['settings:manage'], 'courses:view')).toBe(false);
        expect(hasPermission(['payments:manage'], 'courses:manage')).toBe(false);
        expect(hasPermission(['courses:manage'], 'payments:view')).toBe(false);
    });

    it('returns true for teacher with own permissions', () => {
        expect(hasPermission('Teacher', 'attendance:manage')).toBe(true);
        expect(hasPermission('Teacher', 'courses:view')).toBe(true);
        expect(hasPermission('Teacher', 'attendance:view')).toBe(true);
        expect(hasPermission('Teacher', 'results:view')).toBe(true);
    });

    it('returns false for student with manage permission', () => {
        expect(hasPermission('Student', 'students:manage')).toBe(false);
    });

    it('returns true for student with students:view', () => {
        expect(hasPermission('Student', 'students:view')).toBe(true);
    });

    it('returns true for accountant with payments:view', () => {
        expect(hasPermission('Accountant', 'payments:view')).toBe(true);
    });

    it('returns true for registrar with courses:view', () => {
        expect(hasPermission('Registrar', 'courses:view')).toBe(true);
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

describe('normalizePermissions', () => {
    it('normalizes arrays', () => {
        expect(normalizePermissions(['a', 'b'])).toEqual(['a', 'b']);
    });

    it('normalizes JSON strings', () => {
        expect(normalizePermissions('["a","b"]')).toEqual(['a', 'b']);
    });

    it('normalizes plain strings', () => {
        expect(normalizePermissions('a')).toEqual(['a']);
    });

    it('normalizes object maps', () => {
        expect(normalizePermissions({ a: true, b: false })).toEqual(['a']);
    });

    it('returns [] for null/undefined', () => {
        expect(normalizePermissions(null)).toEqual([]);
        expect(normalizePermissions(undefined)).toEqual([]);
    });
});

describe('resolvePermissions (server-first fallback)', () => {
    it('uses server permissions when present', () => {
        expect(resolvePermissions('Admin', ['courses:manage'])).toEqual(['courses:manage']);
    });

    it('falls back to role defaults when server data is unavailable', () => {
        expect(resolvePermissions('Teacher', null)).toEqual(ROLE_PERMISSIONS.Teacher);
        expect(resolvePermissions('Teacher', undefined)).toEqual(ROLE_PERMISSIONS.Teacher);
    });

    it('does not let fallback defaults override valid server permissions', () => {
        expect(resolvePermissions('Admin', ['*'])).toEqual(['*']);
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
        expect(perms).toContain('students:view');
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
