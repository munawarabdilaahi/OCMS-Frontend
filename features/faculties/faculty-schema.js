import { z } from 'zod';

const statusEnum = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED']);

export const facultySchema = z.object({
    name: z.string().min(1, 'Faculty name is required.'),
    code: z.string().optional(),
    campus_id: z.string().min(1, 'Campus is required.'),
    established_date: z.string().optional(),
    description: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format.').optional().or(z.literal('')),
    website: z.string().url('Website must start with http:// or https://.').optional().or(z.literal('')),
    dean_name: z.string().optional(),
    dean_email: z.string().email('Invalid email format.').optional().or(z.literal('')),
    dean_phone: z.string().optional(),
    office_location: z.string().optional(),
    office_hours: z.string().optional(),
    vision: z.string().optional(),
    mission: z.string().optional(),
    accreditation_body: z.string().optional(),
    accreditation_status: z.string().optional(),
    accreditation_expiry: z.string().optional(),
    max_departments: z.string().optional(),
    student_capacity: z.string().optional(),
    facilities: z.string().optional(),
    research_areas: z.string().optional(),
    status: statusEnum.default('ACTIVE'),
});

export const editFacultySchema = facultySchema;

export const emptyFacultyValues = {
    name: '',
    code: '',
    campus_id: '',
    established_date: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    dean_name: '',
    dean_email: '',
    dean_phone: '',
    office_location: '',
    office_hours: '',
    vision: '',
    mission: '',
    accreditation_body: '',
    accreditation_status: '',
    accreditation_expiry: '',
    max_departments: '',
    student_capacity: '',
    facilities: '',
    research_areas: '',
    status: 'ACTIVE',
};
