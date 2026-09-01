import { z } from 'zod';

const statusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED']);

export const levelSchema = z.object({
    name: z.string().min(1, 'Level name is required.'),
    code: z.string().min(1, 'Level code is required.'),
    program_id: z.string().min(1, 'Program is required.'),
    sort_order: z.string().optional(),
    status: statusEnum.default('ACTIVE'),
});

export const editLevelSchema = levelSchema.extend({
    id: z.string().min(1, 'ID is required.'),
});

export const emptyLevelValues = {
    id: '',
    name: '',
    code: '',
    program_id: '',
    sort_order: '',
    status: 'ACTIVE',
};
