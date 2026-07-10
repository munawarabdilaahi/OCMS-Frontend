import { Award, BookOpen, CalendarDays, CreditCard, Download, Plus, UserCheck } from 'lucide-react';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
import { AreaChartCard } from '@/components/dashboard/AreaChartCard';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RecentActivitiesTable } from '@/components/dashboard/RecentActivitiesTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { getAttendanceRecordsByStudentId, getAttendanceStats } from '@/features/attendance/AttendanceList';
import { getCoursesByStudentId } from '@/features/courses/CoursesList';
import { attendanceData, dashboardStats, enrollmentData, quickInsights, recentActivities, revenueData, } from '@/features/dashboard/dashboard-data';
import { formatCurrency, getPaymentsByStudentId } from '@/features/payments/PaymentsList';
import { getStudentResultSummary } from '@/features/results/ResultsList';
import { ROLES } from '@/lib/roles';
export function Dashboard() {
    const { user } = useAuth();
    if (user?.role === ROLES.STUDENT) {
        return <StudentDashboard user={user}/>;
    }
    return (<div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <CalendarDays className="size-3.5"/>
              Academic Year 2026
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">Live overview</Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor enrollment, attendance, revenue, and recent campus operations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => toast.success('Dashboard report exported.')}>
            <Download />
            Export
          </Button>
          <Button asChild type="button">
            <Link to="/students/add">
              <Plus />
              New record
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (<MetricCard key={stat.title} stat={stat}/>))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {quickInsights.map((insight) => (<Card key={insight.label}>
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm text-muted-foreground">{insight.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-normal">{insight.value}</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <insight.icon className="size-5"/>
              </span>
            </CardContent>
          </Card>))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AreaChartCard title="Enrollment Area Chart" description="Monthly student enrollment growth across the institution." data={enrollmentData} dataKey="enrollment" color="#10b981" gradientId="enrollmentGradient"/>
        </div>
        <AreaChartCard title="Attendance Area Chart" description="Average monthly attendance percentage." data={attendanceData} dataKey="attendance" color="#0ea5e9" gradientId="attendanceGradient" valueFormatter={(value) => `${value}%`}/>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <AreaChartCard title="Revenue Area Chart" description="Term revenue collection trend." data={revenueData} dataKey="revenue" color="#f59e0b" gradientId="revenueGradient" valueFormatter={(value) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(value)}/>
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Operational Snapshot</p>
              <p className="mt-2 text-3xl font-semibold tracking-normal">96.4%</p>
              <p className="mt-1 text-sm text-muted-foreground">Core workflows completed on schedule this week.</p>
            </div>
            <div className="space-y-3">
              {[
            ['Admissions', '82%'],
            ['Finance', '74%'],
            ['Academic records', '91%'],
        ].map(([label, value]) => (<div key={label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span>{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: value }}/>
                  </div>
                </div>))}
            </div>
          </CardContent>
        </Card>
      </div>

      <RecentActivitiesTable activities={recentActivities}/>
    </div>);
}
const personalToneClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    sky: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    teal: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
};
function PersonalMetricCard({ title, value, description, icon: Icon, tone }) {
    return (<Card>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-2 text-2xl">{value}</CardTitle>
        </div>
        <span className={cn('flex size-10 items-center justify-center rounded-md', personalToneClasses[tone])}>
          <Icon className="size-5"/>
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>);
}
function StudentDashboard({ user }) {
    const attendanceRecords = getAttendanceRecordsByStudentId(user.studentId);
    const attendanceStats = getAttendanceStats(attendanceRecords);
    const resultSummary = getStudentResultSummary(user.studentId);
    const courses = getCoursesByStudentId(user.studentId);
    const payments = getPaymentsByStudentId(user.studentId);
    const paidAmount = payments
        .filter((payment) => payment.status === 'Paid')
        .reduce((total, payment) => total + payment.amount, 0);
    const outstandingBalance = payments.reduce((total, payment) => total + payment.balance, 0);
    return (<div className="space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <CalendarDays className="size-3.5"/>
            Academic Year 2026
          </Badge>
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">Student view</Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">My Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personal academic and payment snapshot for {user.studentId}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PersonalMetricCard title="My Attendance" value={`${attendanceStats.rate}%`} description={`${attendanceStats.total} attendance records for your account`} icon={UserCheck} tone="teal"/>
        <PersonalMetricCard title="My GPA" value={resultSummary.averageGpa.toFixed(2)} description={`${resultSummary.results.length} course results published`} icon={Award} tone="emerald"/>
        <PersonalMetricCard title="My Courses" value={courses.length} description="Courses attached to your enrollment" icon={BookOpen} tone="sky"/>
        <PersonalMetricCard title="My Payments" value={formatCurrency(outstandingBalance)} description={`${formatCurrency(paidAmount)} paid this term`} icon={CreditCard} tone="amber"/>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Your active course enrollment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {courses.length ? (courses.map((course) => (<div key={course.code} className="flex items-center justify-between gap-4 rounded-md border p-3">
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-muted-foreground">{course.code} · {course.semester}</p>
                  </div>
                  <Badge variant="secondary">{course.status}</Badge>
                </div>))) : (<p className="text-sm text-muted-foreground">No courses are attached to your student record.</p>)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Payments</CardTitle>
            <CardDescription>Your latest invoice status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {payments.length ? (payments.map((payment) => (<div key={payment.invoiceNumber} className="flex items-center justify-between gap-4 rounded-md border p-3">
                  <div>
                    <p className="font-medium">{payment.invoiceNumber}</p>
                    <p className="text-sm text-muted-foreground">{payment.term} · {formatCurrency(payment.amount)}</p>
                  </div>
                  <Badge variant="secondary">{payment.status}</Badge>
                </div>))) : (<p className="text-sm text-muted-foreground">No payment records are attached to your student record.</p>)}
          </CardContent>
        </Card>
      </div>
    </div>);
}
