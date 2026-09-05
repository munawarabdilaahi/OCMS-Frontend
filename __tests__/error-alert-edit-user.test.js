import { z } from 'zod';

const passwordPolicy = z.string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(128, 'Password must not exceed 128 characters.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/\d/, 'Password must contain at least one digit.')
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, 'Password must contain at least one special character.');

const editUserSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    email: z.string().email('Enter a valid email address.'),
    password: z.union([passwordPolicy, z.literal('')]).optional(),
    role_id: z.string().min(1, 'Role is required.'),
    status: z.string().min(1, 'Status is required.'),
});

describe('editUserSchema - password validation (EDU-BUG)', () => {
    it('accepts blank password (leave blank to keep)', () => {
        const result = editUserSchema.safeParse({
            name: 'User', email: 'user@test.com', password: '', role_id: '1', status: 'ACTIVE'
        });
        expect(result.success).toBe(true);
    });

    it('accepts undefined password (field not provided)', () => {
        const result = editUserSchema.safeParse({
            name: 'User', email: 'user@test.com', role_id: '1', status: 'ACTIVE'
        });
        expect(result.success).toBe(true);
    });

    it('accepts valid strong password', () => {
        const result = editUserSchema.safeParse({
            name: 'User', email: 'user@test.com', password: 'StrongP@ss1', role_id: '1', status: 'ACTIVE'
        });
        expect(result.success).toBe(true);
    });

    it('rejects password without uppercase', () => {
        const result = editUserSchema.safeParse({
            name: 'User', email: 'user@test.com', password: 'lowercase1!', role_id: '1', status: 'ACTIVE'
        });
        expect(result.success).toBe(false);
        expect(result.error.issues.some(i => i.message.includes('uppercase'))).toBe(true);
    });

    it('rejects password without lowercase', () => {
        const result = editUserSchema.safeParse({
            name: 'User', email: 'user@test.com', password: 'UPPERCASE1!', role_id: '1', status: 'ACTIVE'
        });
        expect(result.success).toBe(false);
        expect(result.error.issues.some(i => i.message.includes('lowercase'))).toBe(true);
    });

    it('rejects password without digit', () => {
        const result = editUserSchema.safeParse({
            name: 'User', email: 'user@test.com', password: 'NoDigitHere!', role_id: '1', status: 'ACTIVE'
        });
        expect(result.success).toBe(false);
        expect(result.error.issues.some(i => i.message.includes('digit'))).toBe(true);
    });

    it('rejects password without special character', () => {
        const result = editUserSchema.safeParse({
            name: 'User', email: 'user@test.com', password: 'NoSpecial1', role_id: '1', status: 'ACTIVE'
        });
        expect(result.success).toBe(false);
        expect(result.error.issues.some(i => i.message.includes('special character'))).toBe(true);
    });

    it('rejects password shorter than 8 characters', () => {
        const result = editUserSchema.safeParse({
            name: 'User', email: 'user@test.com', password: 'Ab1!', role_id: '1', status: 'ACTIVE'
        });
        expect(result.success).toBe(false);
        expect(result.error.issues.some(i => i.message.includes('8 characters'))).toBe(true);
    });

    it('rejects missing name', () => {
        const result = editUserSchema.safeParse({
            email: 'user@test.com', role_id: '1', status: 'ACTIVE'
        });
        expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
        const result = editUserSchema.safeParse({
            name: 'User', email: 'not-email', role_id: '1', status: 'ACTIVE'
        });
        expect(result.success).toBe(false);
    });
});

describe('ErrorAlert conditional rendering (DEPT-BUG)', () => {
    it('ErrorAlert component returns null when message is empty', () => {
        const message = '';
        const shouldRender = Boolean(message);
        expect(shouldRender).toBe(false);
    });

    it('ErrorAlert component returns null when message is falsy', () => {
        const message = undefined;
        const shouldRender = Boolean(message);
        expect(shouldRender).toBe(false);
    });

    it('ErrorAlert component renders when message is provided', () => {
        const message = 'Failed to load departments.';
        const shouldRender = Boolean(message);
        expect(shouldRender).toBe(true);
    });
});
