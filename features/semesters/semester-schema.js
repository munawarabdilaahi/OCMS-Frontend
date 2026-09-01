import { z } from 'zod';

const statusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED']);

export const semesterSchema = z.object({
    name: z.string().min(1, 'Semester name is required.'),
    academic_year_id: z.string().min(1, 'Academic year is required.'),
    start_date: z.string().min(1, 'Start date is required.'),
    end_date: z.string().min(1, 'End date is required.'),
    status: statusEnum.default('ACTIVE'),
});

export const editSemesterSchema = semesterSchema.extend({
    id: z.string().min(1, 'ID is required.'),
});

export const emptySemesterValues = {
    id: '',
    name: '',
    academic_year_id: '',
    start_date: '',
    end_date: '',
    status: 'ACTIVE',
};
