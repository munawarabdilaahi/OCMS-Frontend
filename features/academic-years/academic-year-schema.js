import { z } from 'zod';

const statusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED']);

export const academicYearSchema = z.object({
    name: z.string().min(1, 'Academic year name is required.'),
    start_date: z.string().min(1, 'Start date is required.'),
    end_date: z.string().min(1, 'End date is required.'),
    status: statusEnum.default('ACTIVE'),
});

export const editAcademicYearSchema = academicYearSchema.extend({
    id: z.string().min(1, 'ID is required.'),
});

export const emptyAcademicYearValues = {
    id: '',
    name: '',
    start_date: '',
    end_date: '',
    status: 'ACTIVE',
};
