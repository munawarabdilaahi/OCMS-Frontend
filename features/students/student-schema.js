import { z } from 'zod';
import { genders, studentStatuses } from '@/features/students/students-data';
export const addStudentSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters.'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters.'),
    gender: z.enum(genders, { message: 'Select a gender.' }),
    dateOfBirth: z.string().optional(),
    email: z.string().email('Enter a valid student email.'),
    phone: z.string().min(7, 'Phone number is required.'),
    address: z.string().min(5, 'Address is required.'),
    department_id: z.string().min(1, 'Select a department.'),
    status: z.enum(studentStatuses, { message: 'Select a status.' }),
});
export const editStudentSchema = z.object({
    id: z.string().min(1, 'Student ID is required.'),
    firstName: z.string().min(2, 'First name must be at least 2 characters.'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters.'),
    gender: z.enum(genders, { message: 'Select a gender.' }),
    dateOfBirth: z.string().optional(),
    email: z.string().email('Enter a valid student email.'),
    phone: z.string().min(7, 'Phone number is required.'),
    address: z.string().min(5, 'Address is required.'),
    department_id: z.string().min(1, 'Select a department.'),
    status: z.enum(studentStatuses, { message: 'Select a status.' }),
});
export const emptyStudentValues = {
    id: '',
    firstName: '',
    lastName: '',
    gender: 'Female',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    department_id: '',
    status: 'Active',
};
