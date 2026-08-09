import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from '@/context/auth-context';
import { hasAnyPermission, hasPermission, resolvePermissions } from '@/lib/roles';
import { loginRequest, getMeRequest, logoutRequest } from '@/services/auth.service';

const STORAGE_KEY = 'ocms_user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [hydrated, setHydrated] = useState(false);
    const hydrationRef = useRef(false);

    useEffect(() => {
        if (hydrationRef.current) return;
        hydrationRef.current = true;

        async function hydrate() {
            try {
                const freshUser = await getMeRequest();
                if (freshUser) {
                    const nextUser = {
                        id: freshUser.id,
                        name: freshUser.name || '',
                        email: freshUser.email || '',
                        role: freshUser.role?.name || '',
                        permissions: resolvePermissions(freshUser.role?.name || '', freshUser.role?.permissions),
                        studentId: freshUser.student?.id,
                        teacherId: freshUser.teacher?.id,
                        status: freshUser.status || 'ACTIVE',
                        email_verified: freshUser.email_verified || false,
                        last_login: freshUser.last_login,
                    };
                    setUser(nextUser);
                }
            } catch {
                // No session — user stays null
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
            permissions: resolvePermissions(apiUser.role.name, apiUser.role.permissions),
            studentId: apiUser.student?.id,
            teacherId: apiUser.teacher?.id,
            status: apiUser.status || 'ACTIVE',
            email_verified: apiUser.email_verified || false,
            last_login: apiUser.last_login,
        };
        setUser(nextUser);
        return nextUser;
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutRequest();
        } catch {
            // Proceed with local cleanup even if API call fails
        } finally {
            setUser(null);
        }
    }, []);

    const updateUser = useCallback((updates) => {
        setUser((prev) => ({ ...prev, ...updates }));
    }, []);

    const value = useMemo(() => ({
        user,
        isAuthenticated: Boolean(user),
        isHydrated: hydrated,
        hasRole: (roles = []) => roles.includes(user?.role),
        can: (permission) => (user ? hasPermission(user.permissions, permission) : false),
        canAny: (permissions = []) => (user ? hasAnyPermission(user.permissions, permissions) : false),
        login,
        logout,
        updateUser,
    }), [hydrated, login, logout, updateUser, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
