import { z } from 'zod';

const statusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED']);

export const programSchema = z.object({
    name: z.string().min(1, 'Program name is required.'),
    code: z.string().min(1, 'Program code is required.'),
    department_id: z.string().min(1, 'Department is required.'),
    type: z.string().min(1, 'Program type is required.'),
    degree_type: z.string().optional(),
    duration_years: z.string().optional(),
    status: statusEnum.default('ACTIVE'),
});

export const editProgramSchema = programSchema.extend({
    id: z.string().min(1, 'ID is required.'),
});

export const emptyProgramValues = {
    id: '',
    name: '',
    code: '',
    department_id: '',
    type: '',
    degree_type: '',
    duration_years: '',
    status: 'ACTIVE',
};
