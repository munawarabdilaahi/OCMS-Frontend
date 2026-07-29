import { jest } from '@jest/globals';

jest.unstable_mockModule('@/services/api', () => ({
    api: {
        post: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
    },
}));

const { api } = await import('@/services/api');
const { loginRequest, getMeRequest, logoutRequest } = await import('@/services/auth.service');
const { getAdminDashboard } = await import('@/services/dashboard.service');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('auth.service', () => {
    describe('loginRequest', () => {
        it('returns data on successful login', async () => {
            const mockResponse = { data: { data: { token: 'abc', user: { id: 1 } } } };
            api.post.mockResolvedValue(mockResponse);

            const result = await loginRequest({ email: 'a@b.com', password: 'Pw12345' });
            expect(result).toEqual({ token: 'abc', user: { id: 1 } });
            expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', password: 'Pw12345' });
        });

        it('throws on login failure', async () => {
            api.post.mockRejectedValue(new Error('Invalid credentials'));
            await expect(loginRequest({ email: 'bad', password: 'bad' })).rejects.toThrow('Invalid credentials');
        });
    });

    describe('getMeRequest', () => {
        it('returns user data', async () => {
            const userData = { id: 1, name: 'Test', role: { name: 'Admin' } };
            api.get.mockResolvedValue({ data: { data: userData } });

            const result = await getMeRequest();
            expect(result).toEqual(userData);
            expect(api.get).toHaveBeenCalledWith('/auth/me');
        });
    });

    describe('logoutRequest', () => {
        it('returns data on logout', async () => {
            api.post.mockResolvedValue({ data: { data: null } });
            const result = await logoutRequest('refresh-token');
            expect(result).toBeNull();
            expect(api.post).toHaveBeenCalledWith('/auth/logout', { refreshToken: 'refresh-token' });
        });
    });
});

describe('dashboard.service', () => {
    describe('getAdminDashboard', () => {
        it('returns dashboard data', async () => {
            const dashboardData = { students: { total: 100 }, teachers: { total: 20 } };
            api.get.mockResolvedValue({ data: { data: dashboardData } });

            const result = await getAdminDashboard();
            expect(result).toEqual(dashboardData);
            expect(api.get).toHaveBeenCalledWith('/dashboard/admin');
        });
    });
});
