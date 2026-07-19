import { useEffect, useState } from 'react';
import { Link, useParams } from '@/lib/router';
import { CalendarDays, Mail, Phone, Pencil, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getTeacher } from '@/services/teachers.service';
import { cn } from '@/lib/cn';

const statusStyles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    DELETED: 'bg-destructive/10 text-destructive',
};

function InfoGrid({ items }) {
    return (<div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (<div key={item.label} className="rounded-lg border bg-secondary/30 p-4">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="mt-1 font-medium">{item.value}</p>
        </div>))}
    </div>);
}

export default function TeacherProfile() {
    const { teacherId } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!teacherId) return;
        getTeacher(teacherId)
            .then((data) => {
                if (!data) { setError('Teacher not found.'); return; }
                setTeacher(data);
            })
            .catch(() => setError('Failed to load teacher.'))
            .finally(() => setLoading(false));
    }, [teacherId]);
    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading teacher...</p></div>;
    }
    if (error || !teacher) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Teacher not found</AlertTitle>
          <AlertDescription>{error || 'The requested teacher profile does not exist.'}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/teachers">Back to teachers</Link>
        </Button>
      </div>);
    }
    const fullName = teacher.name || `${teacherId}`;
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
                <Badge className={cn(statusStyles[teacher.status] || '')}>{teacher.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{teacher.employee_no || teacherId}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                {teacher.email && <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-4"/>
                  {teacher.email}
                </span>}
                {teacher.phone && <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-4"/>
                  {teacher.phone}
                </span>}
              </div>
            </div>
          </div>
          <Button asChild>
            <Link to={`/teachers/${teacher.id || teacherId}/edit`}>
              <Pencil />
              Edit Profile
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Employment and qualification details.</CardDescription>
        </CardHeader>
        <CardContent>
          <InfoGrid items={[
            { label: 'Full Name', value: fullName },
            { label: 'Employee No', value: teacher.employee_no || '-' },
            { label: 'Department', value: teacher.department || '-' },
            { label: 'Position', value: teacher.position || '-' },
            { label: 'Qualification', value: teacher.qualification || '-' },
            { label: 'Employment Date', value: teacher.employment_date ? new Date(teacher.employment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-' },
            { label: 'Gender', value: teacher.gender || '-' },
            { label: 'Address', value: teacher.address || '-' },
          ]}/>
        </CardContent>
      </Card>
    </div>);
}
