import { jest } from '@jest/globals';

jest.unstable_mockModule('@/services/api', () => ({
    api: {
        post: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
    },
}));

const { api } = await import('@/services/api');
const {
    loginRequest, registerRequest, forgotPasswordRequest,
    resetPasswordRequest, getMeRequest, refreshAccessToken,
    logoutRequest, changePasswordRequest, getSessionsRequest,
    revokeSessionRequest, revokeAllSessionsRequest,
} = await import('@/services/auth.service');

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

    describe('registerRequest', () => {
        it('sends registration data', async () => {
            api.post.mockResolvedValue({ data: { data: { user: { id: 1 } } } });
            const result = await registerRequest({ name: 'John', email: 'j@b.com', password: 'P@ss1234' });
            expect(result).toEqual({ user: { id: 1 } });
            expect(api.post).toHaveBeenCalledWith('/auth/register', { name: 'John', email: 'j@b.com', password: 'P@ss1234' });
        });
    });

    describe('forgotPasswordRequest', () => {
        it('sends forgot password request', async () => {
            api.post.mockResolvedValue({ data: { data: null } });
            const result = await forgotPasswordRequest({ email: 'a@b.com' });
            expect(result).toBeNull();
            expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'a@b.com' });
        });
    });

    describe('resetPasswordRequest', () => {
        it('sends reset password request', async () => {
            api.post.mockResolvedValue({ data: { data: null } });
            const result = await resetPasswordRequest({ token: 'abc', password: 'NewP@ss123', confirmPassword: 'NewP@ss123' });
            expect(result).toBeNull();
            expect(api.post).toHaveBeenCalledWith('/auth/reset-password', { token: 'abc', password: 'NewP@ss123', confirmPassword: 'NewP@ss123' });
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

    describe('refreshAccessToken', () => {
        it('sends refresh token request', async () => {
            api.post.mockResolvedValue({ data: { data: null } });
            const result = await refreshAccessToken();
            expect(result).toBeNull();
            expect(api.post).toHaveBeenCalledWith('/auth/refresh-token');
        });
    });

    describe('logoutRequest', () => {
        it('returns data on logout', async () => {
            api.post.mockResolvedValue({ data: { data: null } });
            const result = await logoutRequest();
            expect(result).toBeNull();
            expect(api.post).toHaveBeenCalledWith('/auth/logout');
        });
    });

    describe('changePasswordRequest', () => {
        it('sends change password request', async () => {
            api.post.mockResolvedValue({ data: { data: null } });
            const result = await changePasswordRequest({
                currentPassword: 'OldP@ss1',
                newPassword: 'NewP@ss1',
                confirmPassword: 'NewP@ss1',
            });
            expect(result).toBeNull();
            expect(api.post).toHaveBeenCalledWith('/auth/change-password', {
                currentPassword: 'OldP@ss1',
                newPassword: 'NewP@ss1',
                confirmPassword: 'NewP@ss1',
            });
        });
    });

    describe('getSessionsRequest', () => {
        it('returns sessions list', async () => {
            const sessions = [{ id: 1, user_agent: 'Chrome' }];
            api.get.mockResolvedValue({ data: { data: sessions } });
            const result = await getSessionsRequest();
            expect(result).toEqual(sessions);
            expect(api.get).toHaveBeenCalledWith('/auth/sessions');
        });
    });

    describe('revokeSessionRequest', () => {
        it('revokes a specific session', async () => {
            api.delete.mockResolvedValue({ data: { data: null } });
            const result = await revokeSessionRequest(1);
            expect(result).toBeNull();
            expect(api.delete).toHaveBeenCalledWith('/auth/sessions/1');
        });
    });

    describe('revokeAllSessionsRequest', () => {
        it('revokes all sessions', async () => {
            api.delete.mockResolvedValue({ data: { data: null } });
            const result = await revokeAllSessionsRequest();
            expect(result).toBeNull();
            expect(api.delete).toHaveBeenCalledWith('/auth/sessions');
        });
    });
});
