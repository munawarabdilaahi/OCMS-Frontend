import { Download, FileBarChart, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from '@/lib/router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { AttendanceDashboardCards, AttendanceTrendChart, attendanceCourses, getAttendanceRecords, getAttendanceRecordsByStudentId, getAttendanceStats, } from '@/features/attendance/AttendanceList';
import { ROLES } from '@/lib/roles';
const statusStyles = {
    Present: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Absent: 'bg-destructive/10 text-destructive',
    Late: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
};
function exportReport(records) {
    const headers = ['Student ID', 'Student Name', 'Course', 'Date', 'Status'];
    const csv = [headers, ...records.map((record) => [record.studentId, record.studentName, record.course, record.date, record.status])]
        .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-attendance-report.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}
export function AttendanceReport() {
    const { user } = useAuth();
    const isStudent = user?.role === ROLES.STUDENT;
    const [searchParams] = useSearchParams();
    const initialCourse = searchParams.get('course') ?? 'all';
    const initialDate = searchParams.get('date') ?? '';
    const [courseFilter, setCourseFilter] = useState(initialCourse);
    const [dateFilter, setDateFilter] = useState(initialDate);
    const [search, setSearch] = useState('');
    const records = useMemo(() => (isStudent ? getAttendanceRecordsByStudentId(user.studentId) : getAttendanceRecords()), [isStudent, user.studentId]);
    const filteredRecords = useMemo(() => records.filter((record) => {
        const matchesCourse = courseFilter === 'all' || record.course === courseFilter;
        const matchesDate = !dateFilter || record.date === dateFilter;
        const haystack = `${record.studentId} ${record.studentName} ${record.course} ${record.status}`.toLowerCase();
        const matchesSearch = haystack.includes(search.toLowerCase());
        return matchesCourse && matchesDate && matchesSearch;
    }), [courseFilter, dateFilter, records, search]);
    const stats = getAttendanceStats(filteredRecords);
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {isStudent ? 'My Attendance Report' : 'Attendance Report'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isStudent
            ? 'Review your attendance summary by course and date.'
            : 'Review attendance summaries by course, date, and student search terms.'}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/attendance">
            <FileBarChart />
            Attendance List
          </Link>
        </Button>
      </div>

      <AttendanceDashboardCards stats={stats}/>
      <AttendanceTrendChart />

      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Filter report records before exporting attendance data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,320px)_220px_170px]">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                <Input className="pl-9" placeholder="Search report..." value={search} onChange={(event) => setSearch(event.target.value)}/>
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Course"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {attendanceCourses.map((course) => (<SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>))}
                </SelectContent>
              </Select>
              <Input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}/>
            </div>

            <Button type="button" variant="outline" onClick={() => exportReport(filteredRecords)}>
              <Download />
              Export Attendance
            </Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length ? (filteredRecords.map((record) => (<TableRow key={record.id}>
                      <TableCell className="font-medium">{record.studentId}</TableCell>
                      <TableCell>{record.studentName}</TableCell>
                      <TableCell>{record.course}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        <Badge className={cn('whitespace-nowrap', statusStyles[record.status])}>{record.status}</Badge>
                      </TableCell>
                    </TableRow>))) : (<TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No report records match the selected filters.
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>);
}
