import { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, Users, Building2, CalendarClock, FileCheck2, UserPlus, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { getStudentStats } from '@/services/students.service';
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
export function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getStudentStats()
            .then((data) => setStats(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);
    const firstName = user?.name?.split(' ')[0] || 'User';
    const departmentData = stats?.departmentBreakdown || [];
    const genderData = stats?.genderBreakdown || [];
    const recentStudents = stats?.recentStudents || [];
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Welcome back, {firstName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here is what is happening across campus today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={stats?.totalStudents} icon={GraduationCap} color="text-emerald-600 dark:text-emerald-400" loading={loading}/>
        <StatCard label="Active Students" value={stats?.activeStudents} icon={Users} color="text-sky-600 dark:text-sky-400" loading={loading}/>
        <StatCard label="Departments" value={stats?.totalDepartments} icon={Building2} color="text-violet-600 dark:text-violet-400" loading={loading}/>
        <StatCard label="Exam Schedules" value={stats?.totalExamSchedules} icon={CalendarClock} color="text-amber-600 dark:text-amber-400" loading={loading}/>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Students by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (<div className="flex h-[300px] items-center justify-center"><p className="text-sm text-muted-foreground">Loading chart...</p></div>) : departmentData.length ? (<ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border"/>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground"/>
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} className="text-muted-foreground"/>
                <Tooltip content={<CustomTooltip />}/>
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {departmentData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]}/>))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>) : (<div className="flex h-[300px] items-center justify-center"><p className="text-sm text-muted-foreground">No department data</p></div>)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (<div className="flex h-[300px] items-center justify-center"><p className="text-sm text-muted-foreground">Loading chart...</p></div>) : genderData.length ? (<ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {genderData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]}/>))}
                </Pie>
                <Tooltip content={<PieTooltip />}/>
                <Legend formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}/>
              </PieChart>
            </ResponsiveContainer>) : (<div className="flex h-[300px] items-center justify-center"><p className="text-sm text-muted-foreground">No gender data</p></div>)}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Enrollments</CardTitle>
              <Badge variant="secondary" className="gap-1.5">
                <UserPlus className="size-3"/>
                Latest 5
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (<div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="flex items-center gap-3"><div className="h-9 w-9 animate-pulse rounded-full bg-muted"/><div className="flex-1 space-y-1.5"><div className="h-3.5 w-32 animate-pulse rounded bg-muted"/><div className="h-3 w-48 animate-pulse rounded bg-muted"/></div></div>))}</div>) : recentStudents.length ? (<div className="space-y-3">
              {recentStudents.map((s) => (<div key={s.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {s.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.department} &middot; {s.email}</p>
                </div>
                <Badge variant="secondary" className={`shrink-0 text-xs ${statusStyles[s.status] || ''}`}>{s.status}</Badge>
              </div>))}
            </div>) : (<div className="flex h-[200px] items-center justify-center"><p className="text-sm text-muted-foreground">No recent enrollments</p></div>)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (<div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="flex justify-between"><div className="h-4 w-32 animate-pulse rounded bg-muted"/><div className="h-4 w-12 animate-pulse rounded bg-muted"/></div>))}</div>) : (<div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-emerald-600"/>
                  <span className="text-sm">Active Rate</span>
                </div>
                <span className="text-sm font-semibold">{stats?.totalStudents ? Math.round((stats.activeStudents / stats.totalStudents) * 100) : 0}%</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-sky-600"/>
                  <span className="text-sm">Total Users</span>
                </div>
                <span className="text-sm font-semibold">{stats?.totalUsers ?? 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="size-4 text-amber-600"/>
                  <span className="text-sm">Exam Results</span>
                </div>
                <span className="text-sm font-semibold">{stats?.totalExamResults ?? 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <CalendarClock className="size-4 text-violet-600"/>
                  <span className="text-sm">Exam Schedules</span>
                </div>
                <span className="text-sm font-semibold">{stats?.totalExamSchedules ?? 0}</span>
              </div>
            </div>)}
          </CardContent>
        </Card>
      </div>
    </div>);
}
