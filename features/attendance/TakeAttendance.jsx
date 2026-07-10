import { CalendarCheck, Loader2, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { cn } from '@/lib/cn';
import { attendanceCourses, attendanceStatuses, attendanceStudents, saveAttendanceRecords, } from '@/features/attendance/AttendanceList';
const statusStyles = {
    Present: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Absent: 'bg-destructive/10 text-destructive',
    Late: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
};
function today() {
    return new Date().toISOString().slice(0, 10);
}
function TakeAttendance() {
    const navigate = useNavigate();
    const [course, setCourse] = useState(attendanceCourses[0]);
    const [date, setDate] = useState(today());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    const [studentStatuses, setStudentStatuses] = useState(() => Object.fromEntries(attendanceStudents.map((student) => [student.id, 'Present'])));
    const summary = useMemo(() => attendanceStatuses.reduce((currentSummary, status) => {
        currentSummary[status] = Object.values(studentStatuses).filter((studentStatus) => studentStatus === status).length;
        return currentSummary;
    }, {}), [studentStatuses]);
    function updateStatus(studentId, status) {
        setStudentStatuses((currentStatuses) => ({ ...currentStatuses, [studentId]: status }));
    }
    async function handleSubmit(event) {
        event.preventDefault();
        if (!course || !date) {
            return;
        }
        setIsSubmitting(true);
        await new Promise((resolve) => window.setTimeout(resolve, 500));
        const timestamp = Date.now();
        const records = attendanceStudents.map((student, index) => ({
            id: `ATT-${timestamp}-${index + 1}`,
            studentId: student.id,
            studentName: student.name,
            course,
            date,
            status: studentStatuses[student.id],
        }));
        saveAttendanceRecords(records);
        setSaved(true);
        navigate('/attendance');
    }
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Take Attendance</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mark attendance for a course session and class date.</p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <CalendarCheck className="size-5"/>
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>Select the course and date before saving attendance records.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {saved && (<Alert variant="success">
                <AlertTitle>Attendance saved</AlertTitle>
                <AlertDescription>The mock attendance records were added to localStorage.</AlertDescription>
              </Alert>)}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select value={course} disabled={isSubmitting} onValueChange={setCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course"/>
                  </SelectTrigger>
                  <SelectContent>
                    {attendanceCourses.map((courseName) => (<SelectItem key={courseName} value={courseName}>
                        {courseName}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} disabled={isSubmitting} onChange={(event) => setDate(event.target.value)}/>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {attendanceStatuses.map((status) => (<div key={status} className="rounded-md border bg-background p-3">
                  <p className="text-sm text-muted-foreground">{status}</p>
                  <p className="mt-1 text-2xl font-semibold">{summary[status] ?? 0}</p>
                </div>))}
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceStudents.map((student) => (<TableRow key={student.id}>
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {attendanceStatuses.map((status) => {
                const isSelected = studentStatuses[student.id] === status;
                return (<Button key={status} type="button" size="sm" variant={isSelected ? 'default' : 'outline'} disabled={isSubmitting} onClick={() => updateStatus(student.id, status)}>
                                <Badge className={cn(isSelected ? 'bg-primary-foreground/15 text-primary-foreground' : statusStyles[status])}>
                                  {status}
                                </Badge>
                              </Button>);
            })}
                        </div>
                      </TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/attendance">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || !course || !date}>
                {isSubmitting ? <Loader2 className="animate-spin"/> : <Save />}
                {isSubmitting ? 'Saving' : 'Save Attendance'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}

export { TakeAttendance };
export default TakeAttendance;
