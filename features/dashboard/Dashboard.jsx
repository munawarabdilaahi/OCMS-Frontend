import { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, Users, Building2, CalendarClock, FileCheck2, UserPlus, Activity, DollarSign, CreditCard, AlertTriangle, Receipt, ClipboardCheck, BarChart3, School, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { getAdminDashboard, getTeacherDashboard, getStudentDashboard } from '@/services/dashboard.service';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const statusStyles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    SUSPENDED: 'bg-destructive/10 text-destructive',
    DELETED: 'bg-muted text-muted-foreground',
};

function StatCard({ label, value, icon: Icon, color, loading }) {
    return (<Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className={`size-5 ${color}`}/>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{loading ? '—' : (value ?? 0).toLocaleString()}</p>
      </CardContent>
    </Card>);
}

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      return (<div className="rounded-lg border bg-card p-3 shadow-md">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{payload[0].value} student{payload[0].value !== 1 ? 's' : ''}</p>
      </div>);
    }
    return null;
}

function PieTooltip({ active, payload }) {
    if (active && payload && payload.length) {
      return (<div className="rounded-lg border bg-card p-3 shadow-md">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">{payload[0].value} student{payload[0].value !== 1 ? 's' : ''}</p>
      </div>);
    }
    return null;
}

function Skeleton({ className }) {
    return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getAdminDashboard()
            .then(setData)
            .catch(() => setError('Failed to load dashboard data.'))
            .finally(() => setLoading(false));
    }, []);

    if (error) return (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>);

    const departmentData = data?.students?.breakdown || [];
    const genderData = data?.students?.genderBreakdown || [];
    const recentStudents = data?.recentStudents || [];

    return (<div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={data?.students?.total} icon={GraduationCap} color="text-emerald-600 dark:text-emerald-400" loading={loading}/>
        <StatCard label="Total Teachers" value={data?.teachers?.total} icon={Users} color="text-sky-600 dark:text-sky-400" loading={loading}/>
        <StatCard label="Total Courses" value={data?.courses?.total} icon={BookOpen} color="text-violet-600 dark:text-violet-400" loading={loading}/>
        <StatCard label="Departments" value={data?.departments?.total} icon={Building2} color="text-amber-600 dark:text-amber-400" loading={loading}/>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Attendance Rate" value={data?.attendance?.rate ? `${data.attendance.rate}%` : '—'} icon={ClipboardCheck} color="text-emerald-600 dark:text-emerald-400" loading={loading}/>
        <StatCard label="Exam Schedules" value={data?.exams?.schedules} icon={CalendarClock} color="text-sky-600 dark:text-sky-400" loading={loading}/>
        <StatCard label="Active Students" value={data?.students?.active} icon={UserCheck} color="text-violet-600 dark:text-violet-400" loading={loading}/>
        <StatCard label="Inactive Students" value={data?.students?.inactive} icon={Users} color="text-rose-600 dark:text-rose-400" loading={loading}/>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Invoiced" value={data?.finance?.total_invoiced ? `$${Number(data.finance.total_invoiced).toLocaleString()}` : '$0'} icon={Receipt} color="text-blue-600 dark:text-blue-400" loading={loading}/>
        <StatCard label="Received (This Month)" value={data?.finance?.total_received ? `$${Number(data.finance.total_received).toLocaleString()}` : '$0'} icon={DollarSign} color="text-emerald-600 dark:text-emerald-400" loading={loading}/>
        <StatCard label="Outstanding" value={data?.finance?.outstanding ? `$${Number(data.finance.outstanding).toLocaleString()}` : '$0'} icon={AlertTriangle} color="text-amber-600 dark:text-amber-400" loading={loading}/>
        <StatCard label="Open Invoices" value={data?.finance?.open_invoices ?? 0} icon={CreditCard} color="text-rose-600 dark:text-rose-400" loading={loading}/>
      </div>
    </div>);
}

function TeacherDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getTeacherDashboard()
            .then(setData)
            .catch(() => setError('Failed to load dashboard data.'))
            .finally(() => setLoading(false));
    }, []);

    if (error) return (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>);
    if (!data && loading) return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>;
    if (!data) return <p className="text-sm text-muted-foreground">No dashboard data available.</p>;

    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Welcome back, {data.profile?.name || user?.name?.split(' ')[0] || 'Teacher'}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{data.profile?.department} &middot; {data.profile?.employee_no}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assigned Courses" value={data.courses?.length} icon={BookOpen} color="text-violet-600 dark:text-violet-400" loading={loading}/>
        <StatCard label="Total Students" value={data.totalStudents} icon={GraduationCap} color="text-emerald-600 dark:text-emerald-400" loading={loading}/>
        <StatCard label="Attendance Rate" value={data.attendance?.rate ? `${data.attendance.rate}%` : '—'} icon={ClipboardCheck} color="text-sky-600 dark:text-sky-400" loading={loading}/>
        <StatCard label="Upcoming Exams" value={data.upcomingExams?.length} icon={CalendarClock} color="text-amber-600 dark:text-amber-400" loading={loading}/>
      </div>

      {data.courses?.length > 0 && (<Card>
        <CardHeader><CardTitle className="text-base">My Courses</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {data.courses.map((c) => (<div key={c.id} className="rounded-lg border p-3">
              <p className="text-sm font-medium">{c.title}</p>
              <p className="text-xs text-muted-foreground">{c.code || 'No code'}</p>
              <p className="mt-2 text-sm"><span className="font-semibold">{c.studentCount}</span> enrolled student{c.studentCount !== 1 ? 's' : ''}</p>
            </div>))}
          </div>
        </CardContent>
      </Card>)}

      <div className="grid gap-4 xl:grid-cols-2">
        {data.upcomingExams?.length > 0 && (<Card>
          <CardHeader><CardTitle className="text-base">Upcoming Exams</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.upcomingExams.map((e) => (<div key={e.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.courseCode} &middot; {e.course}</p>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()}</p>
              </div>))}
            </div>
          </CardContent>
        </Card>)}

        {data.recentResults?.length > 0 && (<Card>
          <CardHeader><CardTitle className="text-base">Recent Results</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.recentResults.map((r) => (<div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{r.studentName}</p>
                  <p className="text-xs text-muted-foreground">{r.courseCode} &middot; {r.course}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{r.score}</p>
                  <Badge variant="secondary" className="text-xs">{r.status}</Badge>
                </div>
              </div>))}
            </div>
          </CardContent>
        </Card>)}
      </div>
    </div>);
}

function StudentDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getStudentDashboard()
            .then(setData)
            .catch(() => setError('Failed to load dashboard data.'))
            .finally(() => setLoading(false));
    }, []);

    if (error) return (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>);
    if (!data && loading) return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>;
    if (!data) return <p className="text-sm text-muted-foreground">No dashboard data available.</p>;

    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Welcome back, {data.profile?.name || user?.name?.split(' ')[0] || 'Student'}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{data.profile?.department} &middot; {data.profile?.admission_no}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Enrolled Courses" value={data.courses?.length} icon={BookOpen} color="text-violet-600 dark:text-violet-400" loading={loading}/>
        <StatCard label="Attendance Rate" value={data.attendance?.rate ? `${data.attendance.rate}%` : 'N/A'} icon={ClipboardCheck} color="text-emerald-600 dark:text-emerald-400" loading={loading}/>
        <StatCard label="Results Published" value={data.progress?.resultsCount} icon={BarChart3} color="text-sky-600 dark:text-sky-400" loading={loading}/>
        <StatCard label="Avg Score" value={data.progress?.averageScore ?? '—'} icon={Activity} color="text-amber-600 dark:text-amber-400" loading={loading}/>
      </div>

      {data.courses?.length > 0 && (<Card>
        <CardHeader><CardTitle className="text-base">My Courses</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {data.courses.map((c) => (<div key={c.id} className="rounded-lg border p-3">
              <p className="text-sm font-medium">{c.title}</p>
              <p className="text-xs text-muted-foreground">{c.code || 'No code'} &middot; {c.teacher || 'No teacher'}</p>
              <p className="mt-2 text-sm">Attendance: <span className="font-semibold">{c.attendanceRate !== null ? `${c.attendanceRate}%` : 'N/A'}</span></p>
            </div>))}
          </div>
        </CardContent>
      </Card>)}

      <div className="grid gap-4 xl:grid-cols-2">
        {data.recentResults?.length > 0 && (<Card>
          <CardHeader><CardTitle className="text-base">Recent Results</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.recentResults.map((r) => (<div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{r.course}</p>
                  <p className="text-xs text-muted-foreground">{r.courseCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{r.total_score}</p>
                  <Badge variant="secondary" className="text-xs">{r.status}</Badge>
                </div>
              </div>))}
            </div>
          </CardContent>
        </Card>)}

        {data.upcomingExams?.length > 0 && (<Card>
          <CardHeader><CardTitle className="text-base">Upcoming Exams</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.upcomingExams.map((e) => (<div key={e.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.courseCode} &middot; {e.course}</p>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()}</p>
              </div>))}
            </div>
          </CardContent>
        </Card>)}
      </div>
    </div>);
}

export function Dashboard() {
    const { user } = useAuth();
    const role = typeof user?.role === 'object' ? user?.role?.name : user?.role;

    if (role === 'Admin' || role === 'SuperAdmin') return <AdminDashboard />;
    if (role === 'Teacher') return <TeacherDashboard />;
    if (role === 'Student') return <StudentDashboard />;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Dashboard</p>
        </div>
        <p className="text-sm text-muted-foreground">Role-specific dashboard is not yet configured for your role.</p>
      </div>
    );
}
