import { ArrowLeft, Award, BookOpenCheck } from 'lucide-react';
import { Link, useParams } from '@/lib/router';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { getStudentResultSummary } from '@/features/results/ResultsList';
import { ROLES } from '@/lib/roles';
function ChartTooltip({ active, payload, label, suffix = '' }) {
    if (!active || !payload?.length) {
        return null;
    }
    return (<div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((item) => (<p key={item.dataKey} className="text-muted-foreground">
          {item.name}: <span className="font-medium text-foreground">{item.value}{suffix}</span>
        </p>))}
    </div>);
}
function GpaCard({ summary }) {
    return (<Card>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardDescription>Current GPA</CardDescription>
          <CardTitle className="mt-2 text-3xl">{summary.averageGpa.toFixed(2)}</CardTitle>
        </div>
        <span className="flex size-11 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          <Award className="size-5"/>
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Average marks: {summary.averageMarks}% across {summary.results.length} courses.
        </p>
      </CardContent>
    </Card>);
}
function GradeDistributionChart({ data }) {
    return (<Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
        <CardDescription>Number of course results by grade.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border))"/>
              <XAxis dataKey="grade" axisLine={false} tickLine={false} tickMargin={12} stroke="rgb(var(--muted-foreground))" fontSize={12}/>
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tickMargin={10} width={32} stroke="rgb(var(--muted-foreground))" fontSize={12}/>
              <Tooltip cursor={{ fill: 'rgb(var(--secondary))' }} content={<ChartTooltip />}/>
              <Bar dataKey="count" name="Results" fill="#0f766e" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>);
}
function PerformanceChart({ data }) {
    return (<Card>
      <CardHeader>
        <CardTitle>Performance Chart</CardTitle>
        <CardDescription>Marks trend across courses for this student.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="studentPerformance" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border))"/>
              <XAxis dataKey="course" axisLine={false} tickLine={false} tickMargin={12} stroke="rgb(var(--muted-foreground))" fontSize={12} interval={0} tickFormatter={(value) => value.split(' ').slice(0, 2).join(' ')}/>
              <YAxis axisLine={false} tickLine={false} tickMargin={10} width={42} domain={[0, 100]} stroke="rgb(var(--muted-foreground))" fontSize={12}/>
              <Tooltip cursor={{ stroke: '#2563eb', strokeOpacity: 0.18, strokeWidth: 2 }} content={<ChartTooltip suffix="%"/>}/>
              <Area type="monotone" dataKey="marks" name="Marks" stroke="#2563eb" strokeWidth={2.5} fill="url(#studentPerformance)" activeDot={{ r: 5, fill: '#2563eb', stroke: 'rgb(var(--background))', strokeWidth: 2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>);
}
export function StudentResultDetails() {
    const { studentId } = useParams();
    const { user } = useAuth();
    const visibleStudentId = user?.role === ROLES.STUDENT ? user.studentId : studentId;
    const isDenied = user?.role === ROLES.STUDENT && studentId !== user.studentId;
    const summary = getStudentResultSummary(visibleStudentId);
    if (!summary.student || isDenied) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Student results not found</AlertTitle>
          <AlertDescription>The requested mock student result record does not exist.</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/results">Back to results</Link>
        </Button>
      </div>);
    }
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Button asChild type="button" variant="ghost" className="-ml-3 w-fit">
            <Link to="/results">
              <ArrowLeft />
              Back to results
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">{summary.student.studentName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{summary.student.studentId} result profile and performance summary.</p>
          </div>
        </div>
        <Badge className="w-fit bg-primary/10 text-primary">
          <BookOpenCheck className="mr-1 size-3.5"/>
          {summary.results.length} Courses
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <GpaCard summary={summary}/>
        <PerformanceChart data={summary.performance}/>
      </div>

      <div className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <GradeDistributionChart data={summary.gradeDistribution}/>
        <Card>
          <CardHeader>
            <CardTitle>Course Results</CardTitle>
            <CardDescription>Detailed marks, grades, and GPA by course.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>GPA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.results.map((result) => (<TableRow key={`${result.studentId}-${result.course}`}>
                      <TableCell className="font-medium">{result.course}</TableCell>
                      <TableCell>{result.marks}</TableCell>
                      <TableCell>{result.grade}</TableCell>
                      <TableCell>{result.gpa.toFixed(1)}</TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);
}
