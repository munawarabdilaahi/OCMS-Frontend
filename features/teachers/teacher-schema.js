import { z } from 'zod';
import { GENDERS } from '@/lib/genders';
import { teacherDepartments, teacherPositions, teacherStatuses } from '@/features/teachers/teachers-data';
export const teacherSchema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.string().email('Enter a valid teacher email.'),
    phone: z.string().min(7, 'Phone number is required.'),
    gender: z.enum(GENDERS, { message: 'Select a gender.' }),
    department: z.enum(teacherDepartments, { message: 'Select a department.' }),
    position: z.enum(teacherPositions, { message: 'Select a position.' }),
    qualification: z.string().min(1, 'Qualification is required.'),
    employmentDate: z.string().optional(),
    address: z.string().optional(),
    status: z.enum(teacherStatuses, { message: 'Select a status.' }),
});
export const emptyTeacherValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    department: 'Computer Science',
    position: 'Lecturer',
    qualification: '',
    employmentDate: '',
    address: '',
    status: 'Active',
};
