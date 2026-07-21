import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from '@/context/auth-context';
import { hasAnyPermission, hasPermission } from '@/lib/roles';
import { loginRequest, getMeRequest, logoutRequest } from '@/services/auth.service';

const STORAGE_KEY = 'ocms_user';
const TOKEN_KEY = 'ocms_token';
const REFRESH_TOKEN_KEY = 'ocms_refresh_token';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [hydrated, setHydrated] = useState(false);
    const hydrationRef = useRef(false);

    useEffect(() => {
        if (hydrationRef.current) return;
        hydrationRef.current = true;

        async function hydrate() {
            try {
                const token = window.localStorage.getItem(TOKEN_KEY);
                if (!token) {
                    setHydrated(true);
                    return;
                }

                const freshUser = await getMeRequest();
                if (freshUser) {
                    const nextUser = {
                        id: freshUser.id,
                        name: freshUser.name || '',
                        email: freshUser.email || '',
                        role: freshUser.role?.name || '',
                        studentId: freshUser.student?.id,
                        teacherId: freshUser.teacher?.id,
                        status: freshUser.status || 'ACTIVE',
                        email_verified: freshUser.email_verified || false,
                        last_login: freshUser.last_login,
                    };
                    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
                    setUser(nextUser);
                } else {
                    window.localStorage.removeItem(STORAGE_KEY);
                    window.localStorage.removeItem(TOKEN_KEY);
                    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
                }
            } catch {
                window.localStorage.removeItem(STORAGE_KEY);
                window.localStorage.removeItem(TOKEN_KEY);
                window.localStorage.removeItem(REFRESH_TOKEN_KEY);
            } finally {
                setHydrated(true);
            }
        }

        hydrate();
    }, []);

    const login = useCallback(async (credentials) => {
        const session = await loginRequest(credentials);
        const apiUser = session?.user;
        if (!apiUser?.role?.name) {
            throw new Error('Authentication failed: role information missing from server response.');
        }
        const nextUser = {
            id: apiUser.id,
            name: apiUser.name || '',
            email: apiUser.email || '',
            role: apiUser.role.name,
            studentId: apiUser.studentId,
            teacherId: apiUser.teacherId,
            status: apiUser.status || 'ACTIVE',
            email_verified: apiUser.email_verified || false,
            last_login: apiUser.last_login,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        window.localStorage.setItem(TOKEN_KEY, session?.token || '');
        if (session?.refreshToken) {
            window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
        }
        setUser(nextUser);
        return nextUser;
    }, []);

    const logout = useCallback(async () => {
        try {
            const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
            if (refreshToken) {
                await logoutRequest(refreshToken);
            }
        } catch {
            // Proceed with local cleanup even if API call fails
        } finally {
            window.localStorage.removeItem(STORAGE_KEY);
            window.localStorage.removeItem(TOKEN_KEY);
            window.localStorage.removeItem(REFRESH_TOKEN_KEY);
            setUser(null);
        }
    }, []);

    const updateUser = useCallback((updates) => {
        setUser((prev) => {
            const nextUser = { ...prev, ...updates };
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
            return nextUser;
        });
    }, []);

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
