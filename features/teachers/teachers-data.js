// Teacher status options used across the app (forms, filters, badges).
export const TEACHER_STATUSES = ['Active', 'On Leave', 'Contract', 'Inactive', 'Retired'];
// Teacher department options used across the app (forms, filters, table).
export const TEACHER_DEPARTMENTS = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Engineering',
    'Biology',
    'Chemistry',
    'English',
    'History',
];
// Teacher position options used across the app.
export const TEACHER_POSITIONS = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Senior Lecturer',
    'Lecturer',
    'Teaching Assistant',
];
// In-memory mock dataset. Replace with a real API client when available.
let teachers = [
    {
        id: 'EMP001',
        fullName: 'Dr. Sarah Johnson',
        email: 'sarah.j@ocms.edu',
        phone: '+1 (234) 567-890',
        department: 'Computer Science',
        position: 'Professor',
        qualification: 'PhD in Artificial Intelligence',
        employmentDate: '2020-08-15',
        status: 'Active',
        courses: ['CS101 - Intro to Programming', 'CS302 - Machine Learning'],
    },
    {
        id: 'EMP002',
        fullName: 'Michael Chen',
        email: 'm.chen@ocms.edu',
        phone: '+1 (555) 123-4567',
        department: 'Mathematics',
        position: 'Associate Professor',
        qualification: 'M.Sc. in Applied Mathematics',
        employmentDate: '2021-01-10',
        status: 'Active',
        courses: ['MATH201 - Calculus I', 'MATH305 - Linear Algebra'],
    },
    {
        id: 'EMP003',
        fullName: 'Dr. Emily Brown',
        email: 'e.brown@ocms.edu',
        phone: '+1 (987) 654-3210',
        department: 'Physics',
        position: 'Senior Lecturer',
        qualification: 'PhD in Theoretical Physics',
        employmentDate: '2019-03-22',
        status: 'On Leave',
        courses: ['PHYS101 - General Physics', 'PHYS400 - Quantum Mechanics'],
    },
    {
        id: 'EMP004',
        fullName: 'James Wilson',
        email: 'j.wilson@ocms.edu',
        phone: '+1 (111) 222-3333',
        department: 'Computer Science',
        position: 'Lecturer',
        qualification: 'M.Sc. in Software Engineering',
        employmentDate: '2022-06-01',
        status: 'Active',
        courses: ['CS205 - Data Structures', 'CS401 - Web Development'],
    },
];
export const mockTeachers = teachers;
export const getTeachers = () => teachers;
export const getTeacherById = (id) => teachers.find((teacher) => teacher.id === id);
export const addTeacher = (newTeacher) => {
    teachers.push(newTeacher);
};
export const updateTeacher = (updatedTeacher) => {
    teachers = teachers.map((teacher) => teacher.id === updatedTeacher.id ? { ...teacher, ...updatedTeacher } : teacher);
};
export const deleteTeacher = (id) => {
    teachers = teachers.filter((teacher) => teacher.id !== id);
};
