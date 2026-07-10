import { z } from 'zod';
import { departments, genders, programs, studentStatuses } from '@/features/students/students-data';
export const studentSchema = z.object({
    id: z.string().min(3, 'Student ID is required.'),
    firstName: z.string().min(2, 'First name must be at least 2 characters.'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters.'),
    gender: z.enum(genders, { message: 'Select a gender.' }),
    dateOfBirth: z.string().min(1, 'Date of birth is required.'),
    email: z.string().email('Enter a valid student email.'),
    phone: z.string().min(7, 'Phone number is required.'),
    address: z.string().min(5, 'Address is required.'),
    department: z.enum(departments, { message: 'Select a department.' }),
    program: z.enum(programs, { message: 'Select a program.' }),
    enrollmentDate: z.string().min(1, 'Enrollment date is required.'),
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
    department: 'Computer Science',
    program: 'BSc Software Engineering',
    enrollmentDate: '',
    status: 'Active',
};
