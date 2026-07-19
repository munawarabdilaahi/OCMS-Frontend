import { useEffect, useState } from 'react';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { ROLES } from '@/lib/roles';
import { getAttendance, getAttendanceStats } from '@/services/attendance.service';
import { getCourses } from '@/services/courses.service';
import { AttendanceList } from '@/features/attendance/AttendanceList';

const statusStyles = {
    PRESENT: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    ABSENT: 'bg-destructive/10 text-destructive',
    LATE: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
};

export function AttendanceReport() {
    const { user } = useAuth();
    const isStudent = user?.role === ROLES.STUDENT;
    const [records, setRecords] = useState([]);
    const [stats, setStats] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getCourses().then((r) => {
            const data = r?.data ?? [];
            if (Array.isArray(data)) setCourses(data);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (selectedCourse) params.course_id = selectedCourse;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        if (isStudent && user?.studentId) params.student_id = user.studentId;

        Promise.all([getAttendance(params), getAttendanceStats(params)])
            .then(([attendanceRes, statsData]) => {
                const data = attendanceRes?.data ?? [];
                setRecords(Array.isArray(data) ? data : []);
                setStats(statsData);
            })
            .catch(() => setError('Failed to load attendance report.'))
            .finally(() => setLoading(false));
    }, [selectedCourse, dateFrom, dateTo, isStudent, user?.studentId]);

    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {isStudent ? 'My Attendance Report' : 'Attendance Report'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review attendance summaries by course and date range.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/attendance">Attendance List</Link>
        </Button>
      </div>

      {error && (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}

      {stats && (<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
            <div><CardDescription>Rate</CardDescription><CardTitle className="mt-2 text-2xl">{stats.rate ?? 0}%</CardTitle></div>
          </CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">{stats.total ?? 0} records</p></CardContent>
        </Card>
        <Card><CardHeader className="flex-row items-start justify-between space-y-0 pb-2"><div><CardDescription>Present</CardDescription><CardTitle className="mt-2 text-2xl">{stats.present ?? 0}</CardTitle></div></CardHeader><CardContent/></Card>
        <Card><CardHeader className="flex-row items-start justify-between space-y-0 pb-2"><div><CardDescription>Absent</CardDescription><CardTitle className="mt-2 text-2xl">{stats.absent ?? 0}</CardTitle></div></CardHeader><CardContent/></Card>
        <Card><CardHeader className="flex-row items-start justify-between space-y-0 pb-2"><div><CardDescription>Late</CardDescription><CardTitle className="mt-2 text-2xl">{stats.late ?? 0}</CardTitle></div></CardHeader><CardContent/></Card>
      </div>)}

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter by course and date range.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger><SelectValue placeholder="All Courses"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date From</label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date To</label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}/>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Records</CardTitle>
          <CardDescription>Filtered attendance records.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading report...</p></div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.length > 0 ? records.map((r) => (<TableRow key={r.id}>
                      <TableCell className="font-medium">{r.studentName}</TableCell>
                      <TableCell>{r.course}</TableCell>
                      <TableCell>{r.date ? new Date(r.date).toLocaleDateString() : '-'}</TableCell>
                      <TableCell><Badge className={cn('whitespace-nowrap', statusStyles[r.status] || '')}>{r.status}</Badge></TableCell>
                      <TableCell>{r.remarks || '-'}</TableCell>
                    </TableRow>)) : (
                    <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No records found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>);
}
