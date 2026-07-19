'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Login } from '@/features/auth/Login';
import { ForgotPassword } from '@/features/auth/ForgotPassword';
import { ResetPassword } from '@/features/auth/ResetPassword';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { StudentsList } from '@/features/students/StudentsList';
import { AddStudent } from '@/features/students/AddStudent';
import { EditStudent } from '@/features/students/EditStudent';
import { StudentProfile } from '@/features/students/StudentProfile';
import TeachersList from '@/features/teachers/TeachersList';
import AddTeacher from '@/features/teachers/AddTeacher';
import EditTeacher from '@/features/teachers/EditTeacher';
import TeacherProfile from '@/features/teachers/TeacherProfile';
import { DepartmentsList } from '@/features/departments/DepartmentsList';
import { AddDepartment } from '@/features/departments/AddDepartment';
import { EditDepartment } from '@/features/departments/EditDepartment';
import { CoursesList } from '@/features/courses/CoursesList';
import { AddCourse } from '@/features/courses/AddCourse';
import { CourseDetails } from '@/features/courses/CourseDetails';
import { EditCourse } from '@/features/courses/EditCourse';
import { AttendanceList } from '@/features/attendance/AttendanceList';
import { TakeAttendance } from '@/features/attendance/TakeAttendance';
import { AttendanceReport } from '@/features/attendance/AttendanceReport';
import { ExamsList } from '@/features/exams/ExamsList';
import { AddExam } from '@/features/exams/AddExam';
import { ResultsList } from '@/features/results/ResultsList';
import { StudentResultDetails } from '@/features/results/StudentResultDetails';
import { PaymentsList } from '@/features/payments/PaymentsList';
import { InvoicesList } from '@/features/payments/InvoicesList';
import { PaymentDetails } from '@/features/payments/PaymentDetails';
import { FeesList } from '@/features/payments/FeesList';
import { Settings } from '@/features/settings/Settings';
import { RolesList } from '@/features/settings/RolesList';
import { Permissions } from '@/features/settings/Permissions';
import { UsersList } from '@/features/settings/UsersList';
import { PlaceholderPage } from '@/features/PlaceholderPage';
const authRoutes = new Set(['/login', '/forgot-password', '/reset-password']);
function matchRoute(pathname) {
    if (pathname === '/' || pathname === '/dashboard')
        return <Dashboard />;
    if (pathname === '/students')
        return <StudentsList />;
    if (pathname === '/students/add')
        return <AddStudent />;
    if (/^\/students\/[^/]+\/edit$/.test(pathname))
        return <EditStudent />;
    if (/^\/students\/[^/]+$/.test(pathname))
        return <StudentProfile />;
    if (pathname === '/teachers')
        return <TeachersList />;
    if (pathname === '/teachers/add')
        return <AddTeacher />;
    if (/^\/teachers\/[^/]+\/edit$/.test(pathname))
        return <EditTeacher />;
    if (/^\/teachers\/[^/]+(\/view)?$/.test(pathname))
        return <TeacherProfile />;
    if (pathname === '/departments')
        return <DepartmentsList />;
    if (pathname === '/departments/add')
        return <AddDepartment />;
    if (/^\/departments\/[^/]+\/edit$/.test(pathname))
        return <EditDepartment />;
    if (pathname === '/courses')
        return <CoursesList />;
    if (pathname === '/courses/add')
        return <AddCourse />;
    if (/^\/courses\/[^/]+\/edit$/.test(pathname))
        return <EditCourse />;
    if (/^\/courses\/[^/]+$/.test(pathname))
        return <CourseDetails />;
    if (pathname === '/attendance')
        return <AttendanceList />;
    if (pathname === '/attendance/take')
        return <TakeAttendance />;
    if (pathname === '/attendance/report')
        return <AttendanceReport />;
    if (pathname === '/exams')
        return <ExamsList />;
    if (pathname === '/exams/add')
        return <AddExam />;
    if (pathname === '/results')
        return <ResultsList />;
    if (/^\/results\/[^/]+$/.test(pathname))
        return <StudentResultDetails />;
    if (pathname === '/payments')
        return <PaymentsList />;
    if (pathname === '/payments/invoices')
        return <InvoicesList />;
    if (pathname === '/payments/fees')
        return <FeesList />;
    if (/^\/payments\/[^/]+$/.test(pathname))
        return <PaymentDetails />;
    if (pathname === '/reports')
        return <PlaceholderPage title="Reports" description="Review academic, attendance, finance, and operational reports."/>;
    if (pathname === '/settings')
        return <Settings />;
    if (pathname === '/settings/roles')
        return <RolesList />;
    if (pathname === '/settings/permissions')
        return <Permissions />;
    if (pathname === '/settings/users')
        return <UsersList />;
    return <PlaceholderPage title="Page not found" description="This frontend route is not registered."/>;
}
function RoutedApp() {
    const pathname = usePathname() || '/';
    const router = useRouter();
    const { isAuthenticated, isHydrated } = useAuth();
    const isAuthRoute = authRoutes.has(pathname);
    useEffect(() => {
        if (isHydrated && !isAuthenticated && !isAuthRoute) {
            router.replace('/login');
        }
    }, [isHydrated, isAuthenticated, isAuthRoute, router]);
    if (isAuthRoute) {
        if (pathname === '/login') {
            return <AuthLayout><Login /></AuthLayout>;
        }
        if (pathname === '/forgot-password') {
            return <AuthLayout><ForgotPassword /></AuthLayout>;
        }
        if (pathname === '/reset-password') {
            return <AuthLayout><ResetPassword /></AuthLayout>;
        }
    }
    if (!isHydrated || !isAuthenticated)
        return null;
    return <DashboardLayout>{matchRoute(pathname)}</DashboardLayout>;
}
export function AppShell() {
    return (<ThemeProvider>
      <AuthProvider>
        <RoutedApp />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>);
}
