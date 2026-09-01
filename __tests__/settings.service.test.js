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
    getProfile, updateProfile, getPreferences,
    updatePreferences, getInstitutionSettings, updateInstitutionSettings,
} = await import('@/services/settings.service');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('settings.service', () => {
    describe('getProfile', () => {
        it('returns profile data', async () => {
            const profile = { name: 'Admin', email: 'admin@ocms.edu' };
            api.get.mockResolvedValue({ data: { data: profile } });
            const result = await getProfile();
            expect(result).toEqual(profile);
            expect(api.get).toHaveBeenCalledWith('/settings/profile');
        });
    });

    describe('updateProfile', () => {
        it('sends update and returns updated data', async () => {
            const updated = { name: 'Updated Admin' };
            api.put.mockResolvedValue({ data: { data: updated } });
            const result = await updateProfile({ name: 'Updated Admin' });
            expect(result).toEqual(updated);
            expect(api.put).toHaveBeenCalledWith('/settings/profile', { name: 'Updated Admin' });
        });
    });

    describe('getPreferences', () => {
        it('returns preferences data', async () => {
            const prefs = { theme: 'dark', language: 'en' };
            api.get.mockResolvedValue({ data: { data: prefs } });
            const result = await getPreferences();
            expect(result).toEqual(prefs);
            expect(api.get).toHaveBeenCalledWith('/settings/preferences');
        });
    });

    describe('updatePreferences', () => {
        it('sends preferences update', async () => {
            const prefs = { theme: 'dark' };
            api.put.mockResolvedValue({ data: { data: prefs } });
            const result = await updatePreferences({ theme: 'dark' });
            expect(result).toEqual(prefs);
            expect(api.put).toHaveBeenCalledWith('/settings/preferences', { theme: 'dark' });
        });
    });

    describe('getInstitutionSettings', () => {
        it('returns institution settings', async () => {
            const settings = { name: 'OCMS University' };
            api.get.mockResolvedValue({ data: { data: settings } });
            const result = await getInstitutionSettings();
            expect(result).toEqual(settings);
            expect(api.get).toHaveBeenCalledWith('/settings/institution');
        });
    });

    describe('updateInstitutionSettings', () => {
        it('sends institution settings update', async () => {
            const settings = { name: 'New University' };
            api.put.mockResolvedValue({ data: { data: settings } });
            const result = await updateInstitutionSettings({ name: 'New University' });
            expect(result).toEqual(settings);
            expect(api.put).toHaveBeenCalledWith('/settings/institution', { name: 'New University' });
        });
    });
});
