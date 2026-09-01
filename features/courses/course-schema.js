import { z } from 'zod';

const statusEnum = z.enum(['ACTIVE', 'INACTIVE']);

export const courseSchema = z.object({
    title: z.string().min(1, 'Course title is required.'),
    code: z.string().optional(),
    credit_hours: z.string().optional(),
    semester: z.string().optional(),
    department_id: z.string().min(1, 'Department is required.'),
    teacher_id: z.string().optional(),
    description: z.string().optional(),
    status: statusEnum.default('ACTIVE'),
});

export const editCourseSchema = courseSchema.extend({
    id: z.string().min(1, 'ID is required.'),
});

export const emptyCourseValues = {
    id: '',
    title: '',
    code: '',
    credit_hours: '',
    semester: '',
    department_id: '',
    teacher_id: '',
    description: '',
    status: 'ACTIVE',
};
