import { useEffect, useState } from 'react';
import { Link, useParams } from '@/lib/router';
import { CalendarDays, CreditCard, GraduationCap, Mail, Pencil, Phone, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getStudent } from '@/services/students.service';
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
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!studentId) return;
        getStudent(studentId)
            .then((response) => {
            const raw = response?.data ?? response;
            if (!raw) { setError('Student not found.'); return; }
            const data = {
                ...raw,
                department: typeof raw.department === 'object' && raw.department !== null ? raw.department.name : raw.department || '',
                firstName: raw.firstName ?? raw.user?.name?.split(' ')[0] ?? '',
                lastName: raw.lastName ?? raw.user?.name?.split(' ').slice(1).join(' ') ?? '',
                email: raw.email ?? raw.user?.email ?? '',
                phone: raw.phone ?? raw.user?.phone ?? '',
            };
            setStudent(data);
        })
            .catch(() => setError('Failed to load student.'))
            .finally(() => setLoading(false));
    }, [studentId]);
    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading student...</p></div>;
    }
    if (error || !student) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Student not found</AlertTitle>
          <AlertDescription>{error || 'The requested student profile does not exist.'}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/students">Back to students</Link>
        </Button>
      </div>);
    }
    const fullName = `${student.firstName ?? student.name ?? ''} ${student.lastName ?? ''}`.trim() || student.name || studentId;
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
                <Badge className={cn(statusStyles[student.status] || '')}>{student.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{student.id || studentId}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                {student.email && <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-4"/>
                  {student.email}
                </span>}
                {student.phone && <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-4"/>
                  {student.phone}
                </span>}
              </div>
            </div>
          </div>
          <Button asChild>
            <Link to={`/students/${student.id || studentId}/edit`}>
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
                { label: 'Gender', value: student.gender || '-' },
                { label: 'Date of Birth', value: student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-' },
                { label: 'Email', value: student.email || '-' },
                { label: 'Phone', value: student.phone || '-' },
                { label: 'Address', value: student.address || '-' },
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
                { label: 'Student ID', value: student.id || studentId },
                { label: 'Department', value: student.department || student.department_id?.toString() || '-' },
                { label: 'Program', value: student.program || '-' },
                { label: 'Enrollment Date', value: student.enrollmentDate || student.enrollment_date || '-' },
                { label: 'Status', value: student.status || '-' },
              ]}/>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Attendance summary for the current term.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Attendance data will be available once the backend attendance endpoints are connected.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>Academic performance summary.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Result data will be available once the backend results endpoints are connected.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>Financial account summary.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Payment data will be available once the backend payments endpoints are connected.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);
}
