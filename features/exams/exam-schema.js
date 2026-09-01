import { z } from 'zod';

const statusEnum = z.enum(['Scheduled', 'Ongoing', 'Completed', 'Cancelled']);

export const examSchema = z.object({
    name: z.string().min(1, 'Exam name is required.'),
    course: z.string().min(1, 'Course is required.'),
    date: z.string().min(1, 'Date is required.'),
    totalMarks: z.string().min(1, 'Total marks is required.'),
    status: statusEnum.default('Scheduled'),
});

export const emptyExamValues = {
    name: '',
    course: '',
    date: '',
    totalMarks: '',
    status: 'Scheduled',
};
