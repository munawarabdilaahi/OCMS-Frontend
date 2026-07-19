import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCourses } from '@/services/courses.service';
import { getStudents } from '@/services/students.service';
import { bulkCreateAttendance } from '@/services/attendance.service';

function TakeAttendance() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({});
    const [remarks, setRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getCourses().then((r) => r?.data ?? []),
            getStudents().then((r) => r?.data ?? []),
        ])
            .then(([courseData, studentData]) => {
                setCourses(Array.isArray(courseData) ? courseData : []);
                setStudents(Array.isArray(studentData) ? studentData : []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    function handleStatusChange(studentId, status) {
        setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!selectedCourse) { toast.error('Please select a course.'); return; }
        if (!date) { toast.error('Please select a date.'); return; }

        const records = students.map((s) => ({
            student_id: s.id,
            status: attendanceData[s.id] || 'PRESENT',
            remarks,
        }));

        setIsSubmitting(true);
        try {
            await bulkCreateAttendance({
                course_id: Number(selectedCourse),
                date,
                records,
            });
            toast.success('Attendance recorded successfully.');
            navigate('/attendance');
        } catch (err) {
            toast.error(err.message || 'Failed to record attendance.');
            setIsSubmitting(false);
        }
    }

    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Take Attendance</h1>
        <p className="mt-1 text-sm text-muted-foreground">Mark attendance for a course session and class date.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>Select the course, date, and mark each student's attendance status.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Course *</Label>
                <Select value={selectedCourse} disabled={isSubmitting} onValueChange={setSelectedCourse}>
                  <SelectTrigger><SelectValue placeholder="Select course"/></SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.title || c.code}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" type="date" value={date} disabled={isSubmitting} onChange={(e) => setDate(e.target.value)}/>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Remarks (optional)</Label>
              <Textarea placeholder="General remarks for this session" value={remarks} disabled={isSubmitting} onChange={(e) => setRemarks(e.target.value)}/>
            </div>

            {students.length > 0 && (<div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (<TableRow key={student.id}>
                        <TableCell className="font-medium">{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Select value={attendanceData[student.id] || 'PRESENT'} disabled={isSubmitting} onValueChange={(v) => handleStatusChange(student.id, v)}>
                            <SelectTrigger className="w-[130px]"><SelectValue/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PRESENT">Present</SelectItem>
                              <SelectItem value="ABSENT">Absent</SelectItem>
                              <SelectItem value="LATE">Late</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>))}
                  </TableBody>
                </Table>
              </div>)}

            {!loading && students.length === 0 && (<p className="text-sm text-muted-foreground">No students found. Add students first.</p>)}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/attendance">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedCourse || !date}>
                {isSubmitting ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}

export { TakeAttendance };
export default TakeAttendance;
