import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '@/context/auth-context';
import { hasAnyPermission, hasPermission, ROLES } from '@/lib/roles';
import { loginRequest } from '@/services/auth.service';
const STORAGE_KEY = 'ocms_user';
const TOKEN_KEY = 'ocms_token';
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        try {
            const storedUser = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
            if (storedUser) {
                setUser(storedUser);
            }
        }
        catch {
        }
        finally {
            setHydrated(true);
        }
    }, []);
    const login = useCallback(async (credentials) => {
        const session = await loginRequest(credentials);
        const apiUser = session?.user;
        const nextUser = {
            id: apiUser?.id ?? 'api-session',
            name: apiUser?.name ?? credentials.name ?? 'OCMS User',
            email: apiUser?.email ?? credentials.email,
            role: apiUser?.role?.name ?? apiUser?.role ?? ROLES.ADMIN,
            studentId: apiUser?.studentId,
            status: apiUser?.status ?? 'Active',
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
        isAuthenticated: Boolean(user),
        isHydrated: hydrated,
        hasRole: (roles = []) => roles.includes(user?.role),
        can: (permission) => hasPermission(user?.role, permission),
        canAny: (permissions = []) => hasAnyPermission(user?.role, permissions),
        login,
        logout,
        updateUser,
    }), [hydrated, login, logout, updateUser, user]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
