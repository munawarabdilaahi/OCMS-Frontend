import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from '@/context/auth-context';
import { hasAnyPermission, hasPermission, ROLES } from '@/lib/roles';
import { loginRequest } from '@/services/auth.service';
const STORAGE_KEY = 'ocms_user';
const TOKEN_KEY = 'ocms_token';
const mockUsers = [
    {
        id: 'USR-001',
        name: 'Admin User',
        email: 'admin@ocms.edu',
        role: ROLES.ADMIN,
        status: 'Active',
    },
    {
        id: 'USR-002',
        name: 'Registrar User',
        email: 'registrar@ocms.edu',
        role: ROLES.REGISTRAR,
        status: 'Active',
    },
    {
        id: 'USR-003',
        name: 'Teacher User',
        email: 'teacher@ocms.edu',
        role: ROLES.TEACHER,
        status: 'Active',
    },
    {
        id: 'USR-004',
        name: 'Accountant User',
        email: 'accountant@ocms.edu',
        role: ROLES.ACCOUNTANT,
        status: 'Active',
    },
    {
        id: 'USR-005',
        studentId: 'STU-2026-001',
        name: 'Amina Hassan',
        email: 'student@ocms.edu',
        role: ROLES.STUDENT,
        status: 'Active',
    },
];
function getStoredUser() {
    if (typeof window === 'undefined')
        return null;
    try {
        const storedUser = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
        if (storedUser?.role === ROLES.STUDENT && !storedUser.studentId) {
            return { ...storedUser, studentId: 'STU-2026-001' };
        }
        return storedUser;
    }
    catch {
        return null;
    }
}
function getNameFromEmail(email) {
    const [name = 'OCMS User'] = email.split('@');
    return name
        .split(/[._-]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getStoredUser());
    const login = useCallback(async (credentials) => {
        const session = await loginRequest(credentials);
        const apiUser = session?.user;
        const mockUser = mockUsers.find((item) => item.email === credentials.email && item.role === credentials.role);
        const nextUser = {
            id: apiUser?.id ?? mockUser?.id ?? 'api-session',
            name: apiUser?.name ?? mockUser?.name ?? getNameFromEmail(credentials.email),
            email: apiUser?.email ?? credentials.email,
            role: apiUser?.role?.name ?? credentials.role ?? ROLES.ADMIN,
            studentId: mockUser?.studentId,
            status: apiUser?.status ?? mockUser?.status ?? 'Active',
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        window.localStorage.setItem(TOKEN_KEY, session?.token || '');
        setUser(nextUser);
        return nextUser;
    }, []);
    const logout = useCallback(() => {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(TOKEN_KEY);
        setUser(null);
    }, []);
    const updateUser = useCallback((updates) => {
        const nextUser = { ...user, ...updates };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
        return nextUser;
    }, [user]);
    const value = useMemo(() => ({
        user,
        users: mockUsers,
        isAuthenticated: Boolean(user),
        hasRole: (roles = []) => roles.includes(user?.role),
        can: (permission) => hasPermission(user?.role, permission),
        canAny: (permissions = []) => hasAnyPermission(user?.role, permissions),
        login,
        logout,
        updateUser,
    }), [login, logout, updateUser, user]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
