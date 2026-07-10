import { z } from 'zod';
import { teacherDepartments, teacherPositions, teacherStatuses } from '@/features/teachers/teachers-data';
export const teacherSchema = z.object({
    id: z.string().min(3, 'Employee ID is required.'),
    fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
    email: z.string().email('Enter a valid teacher email.'),
    phone: z.string().min(7, 'Phone number is required.'),
    department: z.enum(teacherDepartments, { message: 'Select a department.' }),
    position: z.enum(teacherPositions, { message: 'Select a position.' }),
    qualification: z.string().min(3, 'Qualification is required.'),
    employmentDate: z.string().min(1, 'Employment date is required.'),
    status: z.enum(teacherStatuses, { message: 'Select a status.' }),
});
export const emptyTeacherValues = {
    id: '',
    fullName: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    position: 'Lecturer',
    qualification: '',
    employmentDate: '',
    status: 'Active',
};
