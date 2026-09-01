import { z } from 'zod';

const statusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED']);

export const departmentSchema = z.object({
    name: z.string().min(1, 'Department name is required.'),
    code: z.string().optional(),
    faculty_id: z.string().min(1, 'Faculty is required.'),
    established_date: z.string().optional(),
    description: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format.').optional().or(z.literal('')),
    office_location: z.string().optional(),
    vision: z.string().optional(),
    mission: z.string().optional(),
    hod_name: z.string().optional(),
    hod_email: z.string().email('Invalid email format.').optional().or(z.literal('')),
    hod_phone: z.string().optional(),
    max_programs: z.string().optional(),
    max_teachers: z.string().optional(),
    student_capacity: z.string().optional(),
    facilities: z.string().optional(),
    research_areas: z.string().optional(),
    status: statusEnum.default('ACTIVE'),
});

export const editDepartmentSchema = departmentSchema;

export const emptyDepartmentValues = {
    name: '',
    code: '',
    faculty_id: '',
    established_date: '',
    description: '',
    phone: '',
    email: '',
    office_location: '',
    vision: '',
    mission: '',
    hod_name: '',
    hod_email: '',
    hod_phone: '',
    max_programs: '',
    max_teachers: '',
    student_capacity: '',
    facilities: '',
    research_areas: '',
    status: 'ACTIVE',
};
