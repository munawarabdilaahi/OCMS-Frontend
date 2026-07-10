import { BookOpen, DollarSign, GraduationCap, TrendingUp, Users } from 'lucide-react';
export const dashboardStats = [
    {
        title: 'Total Students',
        value: '12,480',
        change: '+8.2%',
        trend: 'from last semester',
        icon: GraduationCap,
        tone: 'emerald',
    },
    {
        title: 'Total Teachers',
        value: '842',
        change: '+3.4%',
        trend: 'active faculty',
        icon: Users,
        tone: 'sky',
    },
    {
        title: 'Total Courses',
        value: '316',
        change: '+18',
        trend: 'published courses',
        icon: BookOpen,
        tone: 'amber',
    },
    {
        title: 'Total Revenue',
        value: '$1.28M',
        change: '+12.5%',
        trend: 'collected this term',
        icon: DollarSign,
        tone: 'teal',
    },
];
export const enrollmentData = [
    { month: 'Jan', enrollment: 8200 },
    { month: 'Feb', enrollment: 8750 },
    { month: 'Mar', enrollment: 9100 },
    { month: 'Apr', enrollment: 9840 },
    { month: 'May', enrollment: 10620 },
    { month: 'Jun', enrollment: 11280 },
    { month: 'Jul', enrollment: 11940 },
    { month: 'Aug', enrollment: 12480 },
];
export const revenueData = [
    { month: 'Jan', revenue: 620000 },
    { month: 'Feb', revenue: 710000 },
    { month: 'Mar', revenue: 760000 },
    { month: 'Apr', revenue: 880000 },
    { month: 'May', revenue: 970000 },
    { month: 'Jun', revenue: 1080000 },
    { month: 'Jul', revenue: 1190000 },
    { month: 'Aug', revenue: 1280000 },
];
export const attendanceData = [
    { month: 'Jan', attendance: 88 },
    { month: 'Feb', attendance: 86 },
    { month: 'Mar', attendance: 91 },
    { month: 'Apr', attendance: 89 },
    { month: 'May', attendance: 94 },
    { month: 'Jun', attendance: 92 },
    { month: 'Jul', attendance: 95 },
    { month: 'Aug', attendance: 93 },
];
export const recentActivities = [
    {
        id: 'ACT-1048',
        activity: 'New student registration approved',
        module: 'Students',
        owner: 'Registrar Office',
        status: 'Completed',
        time: '10 min ago',
    },
    {
        id: 'ACT-1047',
        activity: 'Tuition payment reconciled',
        module: 'Payments',
        owner: 'Finance Desk',
        status: 'Completed',
        time: '26 min ago',
    },
    {
        id: 'ACT-1046',
        activity: 'Attendance report submitted',
        module: 'Attendance',
        owner: 'Dr. Halima Noor',
        status: 'Review',
        time: '44 min ago',
    },
    {
        id: 'ACT-1045',
        activity: 'Course allocation updated',
        module: 'Courses',
        owner: 'Academic Affairs',
        status: 'In Progress',
        time: '1 hr ago',
    },
    {
        id: 'ACT-1044',
        activity: 'Exam results published',
        module: 'Results',
        owner: 'Exam Office',
        status: 'Completed',
        time: '2 hrs ago',
    },
];
export const quickInsights = [
    {
        label: 'Semester growth',
        value: '14.7%',
        icon: TrendingUp,
    },
    {
        label: 'Avg. attendance',
        value: '92.3%',
        icon: Users,
    },
    {
        label: 'Collection rate',
        value: '87.1%',
        icon: DollarSign,
    },
];
