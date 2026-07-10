import { Link, useParams } from '@/lib/router';
import { CalendarDays, CreditCard, GraduationCap, Mail, Pencil, Phone, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getStudentById, getStudentFullName } from '@/features/students/students-data';
import { cn } from '@/lib/cn';
const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Graduated: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    Suspended: 'bg-destructive/10 text-destructive',
};
function InfoGrid({ items }) {
    return (<div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (<div key={item.label} className="rounded-lg border bg-secondary/30 p-4">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="mt-1 font-medium">{item.value}</p>
        </div>))}
    </div>);
}
export function StudentProfile() {
    const { studentId } = useParams();
    const student = getStudentById(studentId);
    if (!student) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Student not found</AlertTitle>
          <AlertDescription>The requested mock student profile does not exist.</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/students">Back to students</Link>
        </Button>
      </div>);
    }
    const fullName = getStudentFullName(student);
    return (<div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-lg bg-primary/15 text-emerald-700 dark:text-teal-200">
              <UserRound className="size-8"/>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-normal">{fullName}</h1>
                <Badge className={cn(statusStyles[student.status])}>{student.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{student.id}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-4"/>
                  {student.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-4"/>
                  {student.phone}
                </span>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link to={`/students/${student.id}/edit`}>
              <Pencil />
              Edit Profile
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="academic">Academic Information</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Core identity and contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              <InfoGrid items={[
            { label: 'Full Name', value: fullName },
            { label: 'Gender', value: student.gender },
            { label: 'Date of Birth', value: student.dateOfBirth },
            { label: 'Email', value: student.email },
            { label: 'Phone', value: student.phone },
            { label: 'Address', value: student.address },
        ]}/>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>Enrollment, department, and program information.</CardDescription>
            </CardHeader>
            <CardContent>
              <InfoGrid items={[
            { label: 'Student ID', value: student.id },
            { label: 'Department', value: student.department },
            { label: 'Program', value: student.program },
            { label: 'Enrollment Date', value: student.enrollmentDate },
            { label: 'Status', value: student.status },
        ]}/>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Mock attendance summary for the current term.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {[
            ['Present', '92%'],
            ['Absent', '5%'],
            ['Excused', '3%'],
        ].map(([label, value]) => (<div key={label} className="rounded-lg border bg-secondary/30 p-4">
                  <CalendarDays className="mb-3 size-5 text-muted-foreground"/>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-2xl font-semibold">{value}</p>
                </div>))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Mock academic performance summary.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {[
            ['Current GPA', '3.72'],
            ['Credits Earned', '84'],
            ['Standing', 'Good'],
        ].map(([label, value]) => (<div key={label} className="rounded-lg border bg-secondary/30 p-4">
                  <GraduationCap className="mb-3 size-5 text-muted-foreground"/>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-2xl font-semibold">{value}</p>
                </div>))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>Mock financial account summary.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {[
            ['Paid', '$4,800'],
            ['Balance', '$950'],
            ['Last Invoice', 'INV-2026-084'],
        ].map(([label, value]) => (<div key={label} className="rounded-lg border bg-secondary/30 p-4">
                  <CreditCard className="mb-3 size-5 text-muted-foreground"/>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-2xl font-semibold">{value}</p>
                </div>))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);
}
