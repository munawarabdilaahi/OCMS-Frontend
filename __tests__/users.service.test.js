import { jest } from '@jest/globals';

jest.unstable_mockModule('@/services/api', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
    },
}));

const { api } = await import('@/services/api');
const { getUsers, getUser, createUser, updateUser, deleteUser } = await import('@/services/users.service');
const { getRoles, getRole, createRole, updateRole, deleteRole } = await import('@/services/roles.service');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('users.service', () => {
    describe('getUsers', () => {
        it('returns full response body with data and meta', async () => {
            const mockUsers = [
                { id: 1, name: 'Admin', email: 'admin@test.com', role: 'Admin', status: 'ACTIVE' },
                { id: 2, name: 'Student', email: 'student@test.com', role: 'Student', status: 'ACTIVE' },
            ];
            const mockMeta = { page: 1, limit: 20, total: 2, totalPages: 1 };
            api.get.mockResolvedValue({
                data: { success: true, message: 'Users retrieved successfully.', data: mockUsers, meta: mockMeta },
            });

            const result = await getUsers({ page: 1, pageSize: 20 });
            expect(result.data).toEqual(mockUsers);
            expect(result.meta).toEqual(mockMeta);
            expect(result.success).toBe(true);
            expect(api.get).toHaveBeenCalledWith('/users', { params: { page: 1, pageSize: 20 } });
        });

        it('returns empty data array when no users exist', async () => {
            api.get.mockResolvedValue({
                data: { success: true, message: 'Users retrieved successfully.', data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } },
            });

            const result = await getUsers({ page: 1 });
            expect(result.data).toEqual([]);
            expect(result.meta.total).toBe(0);
        });

        it('sends search params to API', async () => {
            api.get.mockResolvedValue({
                data: { success: true, data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } },
            });

            await getUsers({ page: 1, pageSize: 10, search: 'admin' });
            expect(api.get).toHaveBeenCalledWith('/users', { params: { page: 1, pageSize: 10, search: 'admin' } });
        });

        it('throws on API failure', async () => {
            api.get.mockRejectedValue(new Error('Access denied.'));
            await expect(getUsers({})).rejects.toThrow('Access denied.');
        });
    });

    describe('getUser', () => {
        it('returns user data from nested response', async () => {
            const user = { id: 1, name: 'Admin' };
            api.get.mockResolvedValue({ data: { data: user } });
            const result = await getUser(1);
            expect(result).toEqual(user);
            expect(api.get).toHaveBeenCalledWith('/users/1');
        });
    });

    describe('createUser', () => {
        it('returns created user data', async () => {
            const user = { id: 3, name: 'New User' };
            api.post.mockResolvedValue({ data: { data: user } });
            const result = await createUser({ name: 'New User', email: 'new@test.com', role_id: 2 });
            expect(result).toEqual(user);
            expect(api.post).toHaveBeenCalledWith('/users', { name: 'New User', email: 'new@test.com', role_id: 2 });
        });
    });

    describe('updateUser', () => {
        it('returns updated user data', async () => {
            const user = { id: 1, name: 'Updated' };
            api.put.mockResolvedValue({ data: { data: user } });
            const result = await updateUser(1, { name: 'Updated' });
            expect(result).toEqual(user);
            expect(api.put).toHaveBeenCalledWith('/users/1', { name: 'Updated' });
        });
    });

    describe('deleteUser', () => {
        it('returns null on successful deletion', async () => {
            api.delete.mockResolvedValue({ data: { data: null } });
            const result = await deleteUser(1);
            expect(result).toBeNull();
            expect(api.delete).toHaveBeenCalledWith('/users/1');
        });
    });
});

describe('roles.service', () => {
    describe('getRoles', () => {
        it('returns roles array from nested response', async () => {
            const roles = [
                { id: 1, name: 'Admin', permissions: ['*'] },
                { id: 2, name: 'Student', permissions: ['dashboard:view'] },
            ];
            api.get.mockResolvedValue({
                data: { success: true, data: roles, meta: { page: 1, limit: 20, total: 2, totalPages: 1 } },
            });

            const result = await getRoles();
            expect(result).toEqual(roles);
            expect(Array.isArray(result)).toBe(true);
            expect(api.get).toHaveBeenCalledWith('/roles');
        });

        it('returns empty array when no roles exist', async () => {
            api.get.mockResolvedValue({
                data: { success: true, data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } },
            });

            const result = await getRoles();
            expect(result).toEqual([]);
        });

        it('throws on API failure', async () => {
            api.get.mockRejectedValue(new Error('Forbidden'));
            await expect(getRoles()).rejects.toThrow('Forbidden');
        });
    });

    describe('getRole', () => {
        it('returns single role data', async () => {
            const role = { id: 1, name: 'Admin', permissions: ['*'] };
            api.get.mockResolvedValue({ data: { data: role } });
            const result = await getRole(1);
            expect(result).toEqual(role);
        });
    });

    describe('createRole', () => {
        it('returns created role', async () => {
            const role = { id: 7, name: 'NewRole' };
            api.post.mockResolvedValue({ data: { data: role } });
            const result = await createRole({ name: 'NewRole' });
            expect(result).toEqual(role);
        });
    });

    describe('updateRole', () => {
        it('returns updated role', async () => {
            const role = { id: 1, name: 'UpdatedRole' };
            api.put.mockResolvedValue({ data: { data: role } });
            const result = await updateRole(1, { name: 'UpdatedRole' });
            expect(result).toEqual(role);
        });
    });

    describe('deleteRole', () => {
        it('returns null on successful deletion', async () => {
            api.delete.mockResolvedValue({ data: { data: null } });
            const result = await deleteRole(1);
            expect(result).toBeNull();
        });
    });
});

describe('UsersList data flow contract', () => {
    it('getUsers response shape matches what UsersList expects', async () => {
        const users = [{ id: 1, name: 'Admin', role: 'Admin', status: 'ACTIVE' }];
        const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };
        api.get.mockResolvedValue({
            data: { success: true, message: 'OK', data: users, meta },
        });

        const usersRes = await getUsers({ page: 1, pageSize: 10 });
        const data = usersRes?.data ?? [];
        const totalCount = usersRes?.meta?.total ?? data.length;

        expect(Array.isArray(data)).toBe(true);
        expect(data).toEqual(users);
        expect(totalCount).toBe(1);
    });

    it('getRoles response shape matches what UsersList expects', async () => {
        const roles = [{ id: 1, name: 'Admin' }, { id: 2, name: 'Student' }];
        api.get.mockResolvedValue({
            data: { success: true, data: roles, meta: { page: 1, limit: 20, total: 2, totalPages: 1 } },
        });

        const rolesData = await getRoles();
        const finalRoles = Array.isArray(rolesData?.data) ? rolesData.data : Array.isArray(rolesData) ? rolesData : [];

        expect(Array.isArray(finalRoles)).toBe(true);
        expect(finalRoles).toEqual(roles);
        expect(finalRoles.length).toBe(2);
    });

    it('handles empty users response gracefully', async () => {
        api.get.mockResolvedValue({
            data: { success: true, data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } },
        });

        const usersRes = await getUsers({ page: 1, pageSize: 10 });
        const data = usersRes?.data ?? [];
        const totalCount = usersRes?.meta?.total ?? data.length;

        expect(data).toEqual([]);
        expect(totalCount).toBe(0);
    });

    it('handles empty roles response gracefully', async () => {
        api.get.mockResolvedValue({
            data: { success: true, data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } },
        });

        const rolesData = await getRoles();
        const finalRoles = Array.isArray(rolesData?.data) ? rolesData.data : Array.isArray(rolesData) ? rolesData : [];

        expect(finalRoles).toEqual([]);
    });
});
