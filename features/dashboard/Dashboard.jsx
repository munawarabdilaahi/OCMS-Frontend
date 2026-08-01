import { useCallback, useEffect, useState } from 'react';
import { BookOpen, GraduationCap, Users, Building2, CalendarClock, DollarSign, CreditCard, AlertTriangle, Receipt, ClipboardCheck, UserCheck, BarChart3, Activity, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { getAdminDashboard, getTeacherDashboard, getStudentDashboard } from '@/services/dashboard.service';
import { StatCard } from '@/components/common/StatCard';

function DashboardSkeleton({ count = 12 }) {
    return (
        <div className="space-y-6" aria-hidden="true">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: count }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function DashboardError({ message, onRetry }) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Failed to load dashboard</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
                <p>{message}</p>
                {onRetry && (
                    <Button variant="outline" size="sm" onClick={onRetry} className="w-fit">
                        <RefreshCw className="mr-1.5 size-3.5" />
                        Try again
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(() => {
        setLoading(true);
        setError('');
        getAdminDashboard()
            .then(setData)
            .catch(() => setError('Failed to load dashboard data.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (error) return <DashboardError message={error} onRetry={fetchData} />;
    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Overview of campus metrics and statistics.</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchData}>
                    <RefreshCw className="mr-1.5 size-3.5" />
                    Refresh
                </Button>
            </div>

            <section aria-labelledby="section-core-metrics">
                <h2 id="section-core-metrics" className="sr-only">Core Metrics</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Students" value={data?.students?.total} icon={GraduationCap} color="text-emerald-600 dark:text-emerald-400" />
                    <StatCard label="Total Teachers" value={data?.teachers?.total} icon={Users} color="text-sky-600 dark:text-sky-400" />
                    <StatCard label="Total Courses" value={data?.courses?.total} icon={BookOpen} color="text-violet-600 dark:text-violet-400" />
                    <StatCard label="Departments" value={data?.departments?.total} icon={Building2} color="text-amber-600 dark:text-amber-400" />
                </div>
            </section>

            <section aria-labelledby="section-academic-metrics">
                <h2 id="section-academic-metrics" className="mb-3 text-sm font-medium text-muted-foreground">Academic Overview</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Attendance Rate" value={data?.attendance?.rate ? `${data.attendance.rate}%` : '\u2014'} icon={ClipboardCheck} color="text-emerald-600 dark:text-emerald-400" />
                    <StatCard label="Exam Schedules" value={data?.exams?.schedules} icon={CalendarClock} color="text-sky-600 dark:text-sky-400" />
                    <StatCard label="Active Students" value={data?.students?.active} icon={UserCheck} color="text-violet-600 dark:text-violet-400" />
                    <StatCard label="Inactive Students" value={data?.students?.inactive} icon={Users} color="text-rose-600 dark:text-rose-400" />
                </div>
            </section>

            <section aria-labelledby="section-finance-metrics">
                <h2 id="section-finance-metrics" className="mb-3 text-sm font-medium text-muted-foreground">Financial Overview</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Invoiced" value={data?.finance?.total_invoiced ? `$${Number(data.finance.total_invoiced).toLocaleString()}` : '$0'} icon={Receipt} color="text-blue-600 dark:text-blue-400" />
                    <StatCard label="Received This Month" value={data?.finance?.total_received ? `$${Number(data.finance.total_received).toLocaleString()}` : '$0'} icon={DollarSign} color="text-emerald-600 dark:text-emerald-400" />
                    <StatCard label="Outstanding" value={data?.finance?.outstanding ? `$${Number(data.finance.outstanding).toLocaleString()}` : '$0'} icon={AlertTriangle} color="text-amber-600 dark:text-amber-400" />
                    <StatCard label="Open Invoices" value={data?.finance?.open_invoices ?? 0} icon={CreditCard} color="text-rose-600 dark:text-rose-400" />
                </div>
            </section>
        </div>
    );
}

function TeacherDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(() => {
        setLoading(true);
        setError('');
        getTeacherDashboard()
            .then(setData)
            .catch(() => setError('Failed to load dashboard data.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (error) return <DashboardError message={error} onRetry={fetchData} />;
    if (loading) return <DashboardSkeleton count={4} />;
    if (!data) {
        return (
            <div className="flex min-h-40 items-center justify-center">
                <p className="text-sm text-muted-foreground">No dashboard data available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Welcome back, {data.profile?.name || user?.name?.split(' ')[0] || 'Teacher'}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {data.profile?.department}
                        {data.profile?.department && data.profile?.employee_no ? ' \u00B7 ' : ''}
                        {data.profile?.employee_no}
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchData}>
                    <RefreshCw className="mr-1.5 size-3.5" />
                    Refresh
                </Button>
            </div>

            <section aria-labelledby="teacher-stats">
                <h2 id="teacher-stats" className="sr-only">Your Statistics</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Assigned Courses" value={data.courses?.length} icon={BookOpen} color="text-violet-600 dark:text-violet-400" />
                    <StatCard label="Total Students" value={data.totalStudents} icon={GraduationCap} color="text-emerald-600 dark:text-emerald-400" />
                    <StatCard label="Attendance Rate" value={data.attendance?.rate ? `${data.attendance.rate}%` : '\u2014'} icon={ClipboardCheck} color="text-sky-600 dark:text-sky-400" />
                    <StatCard label="Upcoming Exams" value={data.upcomingExams?.length} icon={CalendarClock} color="text-amber-600 dark:text-amber-400" />
                </div>
            </section>

            {data.courses?.length > 0 && (
                <section aria-labelledby="my-courses">
                    <Card>
                        <CardHeader>
                            <CardTitle id="my-courses" className="text-base">My Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {data.courses.map((c) => (
                                    <div key={c.id} className="rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50">
                                        <p className="text-sm font-medium">{c.title}</p>
                                        <p className="text-xs text-muted-foreground">{c.code || 'No code'}</p>
                                        <p className="mt-2 text-sm">
                                            <span className="font-semibold tabular-nums">{c.studentCount}</span>
                                            {' '}enrolled student{c.studentCount !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}

            <div className="grid gap-4 xl:grid-cols-2">
                {data.upcomingExams?.length > 0 && (
                    <section aria-labelledby="teacher-upcoming-exams">
                        <Card>
                            <CardHeader>
                                <CardTitle id="teacher-upcoming-exams" className="text-base">Upcoming Exams</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {data.upcomingExams.map((e) => (
                                        <div key={e.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50">
                                            <div>
                                                <p className="text-sm font-medium">{e.title}</p>
                                                <p className="text-xs text-muted-foreground">{e.courseCode} &middot; {e.course}</p>
                                            </div>
                                            <time className="text-xs text-muted-foreground" dateTime={e.date}>
                                                {new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </time>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                )}

                {data.recentResults?.length > 0 && (
                    <section aria-labelledby="teacher-recent-results">
                        <Card>
                            <CardHeader>
                                <CardTitle id="teacher-recent-results" className="text-base">Recent Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {data.recentResults.map((r) => (
                                        <div key={r.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50">
                                            <div>
                                                <p className="text-sm font-medium">{r.studentName}</p>
                                                <p className="text-xs text-muted-foreground">{r.courseCode} &middot; {r.course}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold tabular-nums">{r.score}</p>
                                                <Badge variant="secondary" className="text-xs">{r.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                )}
            </div>
        </div>
    );
}

function StudentDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(() => {
        setLoading(true);
        setError('');
        getStudentDashboard()
            .then(setData)
            .catch(() => setError('Failed to load dashboard data.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (error) return <DashboardError message={error} onRetry={fetchData} />;
    if (loading) return <DashboardSkeleton count={4} />;
    if (!data) {
        return (
            <div className="flex min-h-40 items-center justify-center">
                <p className="text-sm text-muted-foreground">No dashboard data available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Welcome back, {data.profile?.name || user?.name?.split(' ')[0] || 'Student'}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {data.profile?.department}
                        {data.profile?.department && data.profile?.admission_no ? ' \u00B7 ' : ''}
                        {data.profile?.admission_no}
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchData}>
                    <RefreshCw className="mr-1.5 size-3.5" />
                    Refresh
                </Button>
            </div>

            <section aria-labelledby="student-stats">
                <h2 id="student-stats" className="sr-only">Your Progress</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Enrolled Courses" value={data.courses?.length} icon={BookOpen} color="text-violet-600 dark:text-violet-400" />
                    <StatCard label="Attendance Rate" value={data.attendance?.rate ? `${data.attendance.rate}%` : 'N/A'} icon={ClipboardCheck} color="text-emerald-600 dark:text-emerald-400" />
                    <StatCard label="Results Published" value={data.progress?.resultsCount} icon={BarChart3} color="text-sky-600 dark:text-sky-400" />
                    <StatCard label="Avg Score" value={data.progress?.averageScore ?? '\u2014'} icon={Activity} color="text-amber-600 dark:text-amber-400" />
                </div>
            </section>

            {data.courses?.length > 0 && (
                <section aria-labelledby="student-courses">
                    <Card>
                        <CardHeader>
                            <CardTitle id="student-courses" className="text-base">My Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {data.courses.map((c) => (
                                    <div key={c.id} className="rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50">
                                        <p className="text-sm font-medium">{c.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {c.code || 'No code'}
                                            {c.code && c.teacher ? ' \u00B7 ' : ''}
                                            {c.teacher || 'No teacher'}
                                        </p>
                                        <p className="mt-2 text-sm">
                                            Attendance:{' '}
                                            <span className="font-semibold tabular-nums">
                                                {c.attendanceRate !== null ? `${c.attendanceRate}%` : 'N/A'}
                                            </span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}

            <div className="grid gap-4 xl:grid-cols-2">
                {data.recentResults?.length > 0 && (
                    <section aria-labelledby="student-recent-results">
                        <Card>
                            <CardHeader>
                                <CardTitle id="student-recent-results" className="text-base">Recent Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {data.recentResults.map((r) => (
                                        <div key={r.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50">
                                            <div>
                                                <p className="text-sm font-medium">{r.course}</p>
                                                <p className="text-xs text-muted-foreground">{r.courseCode}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold tabular-nums">{r.total_score}</p>
                                                <Badge variant="secondary" className="text-xs">{r.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                )}

                {data.upcomingExams?.length > 0 && (
                    <section aria-labelledby="student-upcoming-exams">
                        <Card>
                            <CardHeader>
                                <CardTitle id="student-upcoming-exams" className="text-base">Upcoming Exams</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {data.upcomingExams.map((e) => (
                                        <div key={e.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50">
                                            <div>
                                                <p className="text-sm font-medium">{e.title}</p>
                                                <p className="text-xs text-muted-foreground">{e.courseCode} &middot; {e.course}</p>
                                            </div>
                                            <time className="text-xs text-muted-foreground" dateTime={e.date}>
                                                {new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </time>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                )}
            </div>
        </div>
    );
}

export function Dashboard() {
    const { user } = useAuth();
    const role = typeof user?.role === 'object' ? user?.role?.name : user?.role;

    if (!user) return null;

    if (role === 'Admin' || role === 'SuperAdmin') return <AdminDashboard />;
    if (role === 'Teacher') return <TeacherDashboard />;
    if (role === 'Student') return <StudentDashboard />;
    if (role === 'Registrar') return <AdminDashboard />;
    if (role === 'Accountant') return <AdminDashboard />;

    return <AdminDashboard />;
}
