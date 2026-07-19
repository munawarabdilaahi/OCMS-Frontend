import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { courseSemesters, courseStatuses } from '@/features/courses/CoursesList';
import { getDepartments } from '@/services/departments.service';
import { getCourse, updateCourse } from '@/services/courses.service';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

export function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [title, setTitle] = useState('');
    const [creditHours, setCreditHours] = useState('');
    const [semester, setSemester] = useState('');
    const [status, setStatus] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getDepartments().then((response) => {
            const data = response?.data ?? [];
            if (Array.isArray(data)) setDepartments(data);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        if (!id) return;
        getCourse(id)
            .then((data) => {
                if (!data) { setError('Course not found.'); return; }
                setCode(data.code || '');
                setTitle(data.title || '');
                setCreditHours(data.credit_hours?.toString() || '');
                setSemester(data.semester || courseSemesters[0]);
                setStatus(data.status || 'ACTIVE');
                setDepartmentId(data.department_id?.toString() || '');
            })
            .catch(() => setError('Failed to load course.'))
            .finally(() => setLoading(false));
    }, [id]);

    function validate() {
        const errs = {};
        if (!title.trim()) errs.title = 'Course title is required.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await updateCourse(Number(id), {
                code: code.trim() || undefined,
                title: title.trim(),
                credit_hours: creditHours ? Number(creditHours) : undefined,
                semester,
                status,
                department_id: departmentId ? Number(departmentId) : undefined,
            });
            toast.success('Course updated successfully.');
            navigate('/courses');
        } catch (err) {
            toast.error(err.message || 'Failed to update course.');
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading course...</p></div>;
    }
    if (error) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Course not found</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/courses">Back to courses</Link>
        </Button>
      </div>);
    }

    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Edit Course</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update the course record.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Update the course code, title, and academic details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input id="code" placeholder="e.g. CS101" value={code} disabled={isSubmitting} onChange={(e) => setCode(e.target.value)}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input id="title" placeholder="e.g. Introduction to Programming" value={title} disabled={isSubmitting} aria-invalid={Boolean(errors.title)} onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}/>
                <FieldError message={errors.title}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditHours">Credit Hours</Label>
                <Input id="creditHours" type="number" min="1" max="10" value={creditHours} disabled={isSubmitting} onChange={(e) => setCreditHours(e.target.value)}/>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={departmentId} disabled={isSubmitting} onValueChange={setDepartmentId}>
                  <SelectTrigger><SelectValue placeholder="Select department"/></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (<SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={semester} disabled={isSubmitting} onValueChange={setSemester}>
                  <SelectTrigger><SelectValue placeholder="Select semester"/></SelectTrigger>
                  <SelectContent>
                    {courseSemesters.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} disabled={isSubmitting} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue placeholder="Select status"/></SelectTrigger>
                  <SelectContent>
                    {courseStatuses.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/courses">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
