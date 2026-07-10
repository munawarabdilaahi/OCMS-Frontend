import { ArrowLeft, CalendarDays, Clock3, GraduationCap, Pencil, UserRound } from 'lucide-react';
import { Link, useParams } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { getCourseByCode } from '@/features/courses/CoursesList';
import { ROLES } from '@/lib/roles';
const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Draft: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Completed: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    Archived: 'bg-muted text-muted-foreground',
};
function InfoItem({ icon: Icon, label, value }) {
    return (<div className="rounded-md border bg-background p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4"/>
        {label}
      </div>
      <p className="mt-2 font-medium">{value}</p>
    </div>);
}
function EmptyTableRow({ colSpan, message }) {
    return (<TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>);
}
export function CourseDetails() {
    const { courseCode } = useParams();
    const { user } = useAuth();
    const course = getCourseByCode(courseCode);
    const enrolledStudents = course?.enrolledStudents ?? [];
    const isStudent = user?.role === ROLES.STUDENT;
    const canViewCourse = !isStudent || enrolledStudents.some((student) => student.id === user.studentId);
    if (!course || !canViewCourse) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Course not found</AlertTitle>
          <AlertDescription>The requested mock course record does not exist.</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/courses">Back to courses</Link>
        </Button>
      </div>);
    }
    const averageAttendance = enrolledStudents.length
        ? Math.round(enrolledStudents.reduce((total, student) => total + Number.parseInt(student.attendance, 10), 0) /
            enrolledStudents.length)
        : 0;
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Button asChild type="button" variant="ghost" className="-ml-3 w-fit">
            <Link to="/courses">
              <ArrowLeft />
              Back to courses
            </Link>
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">{course.name}</h1>
              <Badge className={cn('whitespace-nowrap', statusStyles[course.status])}>{course.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {course.code} · {course.department}
            </p>
          </div>
        </div>

        {!isStudent && (<Button asChild>
            <Link to={`/courses/${course.code}/edit`}>
              <Pencil />
              Edit Course
            </Link>
          </Button>)}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Enrolled Students</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoItem icon={Clock3} label="Credit Hours" value={`${course.creditHours} hours`}/>
            <InfoItem icon={UserRound} label="Assigned Teacher" value={course.teacher}/>
            <InfoItem icon={CalendarDays} label="Semester" value={course.semester}/>
            <InfoItem icon={GraduationCap} label="Enrolled Students" value={enrolledStudents.length}/>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
              <CardDescription>Academic scope and current catalog information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">{course.description}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{course.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{course.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>Students currently attached to this mock course record.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledStudents.length ? (enrolledStudents.map((student) => (<TableRow key={student.id}>
                          <TableCell className="font-medium">{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.attendance}</TableCell>
                          <TableCell>{student.result}</TableCell>
                        </TableRow>))) : (<EmptyTableRow colSpan={4} message="No students are enrolled in this course."/>)}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Attendance summary for enrolled students.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <InfoItem icon={GraduationCap} label="Tracked Students" value={enrolledStudents.length}/>
                <InfoItem icon={Clock3} label="Average Attendance" value={`${averageAttendance}%`}/>
                <InfoItem icon={CalendarDays} label="Current Semester" value={course.semester}/>
              </div>

              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Attendance Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledStudents.length ? (enrolledStudents.map((student) => (<TableRow key={student.id}>
                          <TableCell className="font-medium">{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.attendance}</TableCell>
                        </TableRow>))) : (<EmptyTableRow colSpan={3} message="No attendance records are available for this course."/>)}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Mock grade outcomes for enrolled students.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Final Result</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledStudents.length ? (enrolledStudents.map((student) => (<TableRow key={student.id}>
                          <TableCell className="font-medium">{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.result}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Published</Badge>
                          </TableCell>
                        </TableRow>))) : (<EmptyTableRow colSpan={4} message="No result records are available for this course."/>)}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);
}
