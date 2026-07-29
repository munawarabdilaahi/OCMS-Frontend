import { lazy } from 'react';

function lazyLoad(importFn) {
    const LazyComponent = lazy(importFn);
    return LazyComponent;
}

export const routeComponents = {
    '/': lazyLoad(() => import('@/features/dashboard/Dashboard').then(m => ({ default: m.Dashboard }))),
    '/dashboard': lazyLoad(() => import('@/features/dashboard/Dashboard').then(m => ({ default: m.Dashboard }))),
    '/students': lazyLoad(() => import('@/features/students/StudentsList').then(m => ({ default: m.StudentsList }))),
    '/students/add': lazyLoad(() => import('@/features/students/AddStudent').then(m => ({ default: m.AddStudent }))),
    '/students/:id/edit': lazyLoad(() => import('@/features/students/EditStudent').then(m => ({ default: m.EditStudent }))),
    '/students/:id': lazyLoad(() => import('@/features/students/StudentProfile').then(m => ({ default: m.StudentProfile }))),
    '/teachers': lazyLoad(() => import('@/features/teachers/TeachersList')),
    '/teachers/add': lazyLoad(() => import('@/features/teachers/AddTeacher')),
    '/teachers/:id/edit': lazyLoad(() => import('@/features/teachers/EditTeacher')),
    '/teachers/:id': lazyLoad(() => import('@/features/teachers/TeacherProfile')),
    '/departments': lazyLoad(() => import('@/features/departments/DepartmentsList').then(m => ({ default: m.DepartmentsList }))),
    '/departments/add': lazyLoad(() => import('@/features/departments/AddDepartment').then(m => ({ default: m.AddDepartment }))),
    '/departments/:id/edit': lazyLoad(() => import('@/features/departments/EditDepartment').then(m => ({ default: m.EditDepartment }))),
    '/courses': lazyLoad(() => import('@/features/courses/CoursesList').then(m => ({ default: m.CoursesList }))),
    '/courses/add': lazyLoad(() => import('@/features/courses/AddCourse').then(m => ({ default: m.AddCourse }))),
    '/courses/:id/edit': lazyLoad(() => import('@/features/courses/EditCourse').then(m => ({ default: m.EditCourse }))),
    '/courses/:id': lazyLoad(() => import('@/features/courses/CourseDetails').then(m => ({ default: m.CourseDetails }))),
    '/attendance': lazyLoad(() => import('@/features/attendance/AttendanceList').then(m => ({ default: m.AttendanceList }))),
    '/attendance/take': lazyLoad(() => import('@/features/attendance/TakeAttendance').then(m => ({ default: m.TakeAttendance }))),
    '/attendance/report': lazyLoad(() => import('@/features/attendance/AttendanceReport').then(m => ({ default: m.AttendanceReport }))),
    '/exams': lazyLoad(() => import('@/features/exams/ExamsList').then(m => ({ default: m.ExamsList }))),
    '/exams/add': lazyLoad(() => import('@/features/exams/AddExam').then(m => ({ default: m.AddExam }))),
    '/results': lazyLoad(() => import('@/features/results/ResultsList').then(m => ({ default: m.ResultsList }))),
    '/results/:id': lazyLoad(() => import('@/features/results/StudentResultDetails').then(m => ({ default: m.StudentResultDetails }))),
    '/payments': lazyLoad(() => import('@/features/payments/PaymentsList').then(m => ({ default: m.PaymentsList }))),
    '/payments/invoices': lazyLoad(() => import('@/features/payments/InvoicesList').then(m => ({ default: m.InvoicesList }))),
    '/payments/fees': lazyLoad(() => import('@/features/payments/FeesList').then(m => ({ default: m.FeesList }))),
    '/payments/:id': lazyLoad(() => import('@/features/payments/PaymentDetails').then(m => ({ default: m.PaymentDetails }))),
    '/settings': lazyLoad(() => import('@/features/settings/Settings').then(m => ({ default: m.Settings }))),
    '/settings/roles': lazyLoad(() => import('@/features/settings/RolesList').then(m => ({ default: m.RolesList }))),
    '/settings/permissions': lazyLoad(() => import('@/features/settings/Permissions').then(m => ({ default: m.Permissions }))),
    '/settings/users': lazyLoad(() => import('@/features/settings/UsersList').then(m => ({ default: m.UsersList }))),
};

const dynamicRoutes = [
    { pattern: /^\/students\/([^/]+)\/edit$/, key: '/students/:id/edit' },
    { pattern: /^\/students\/([^/]+)$/, key: '/students/:id' },
    { pattern: /^\/teachers\/([^/]+)\/edit$/, key: '/teachers/:id/edit' },
    { pattern: /^\/teachers\/([^/]+)(\/view)?$/, key: '/teachers/:id' },
    { pattern: /^\/departments\/([^/]+)\/edit$/, key: '/departments/:id/edit' },
    { pattern: /^\/courses\/([^/]+)\/edit$/, key: '/courses/:id/edit' },
    { pattern: /^\/courses\/([^/]+)$/, key: '/courses/:id' },
    { pattern: /^\/results\/([^/]+)$/, key: '/results/:id' },
    { pattern: /^\/payments\/([^/]+)$/, key: '/payments/:id' },
];

export function matchRoute(pathname) {
    const exact = routeComponents[pathname];
    if (exact) return exact;

    for (const { pattern, key } of dynamicRoutes) {
        if (pattern.test(pathname)) {
            return routeComponents[key];
        }
    }

    if (pathname === '/reports') {
        return lazyLoad(() => import('@/features/PlaceholderPage').then(m => ({
            default: () => {
                const P = m.PlaceholderPage;
                return <P title="Reports" description="Review academic, attendance, finance, and operational reports." />;
            }
        })));
    }

    return null;
}
