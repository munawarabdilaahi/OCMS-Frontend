import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from '@/lib/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getDepartment, updateDepartment, getDepartmentStats } from '@/services/departments.service';
import { getFaculties } from '@/services/faculties.service';
import { LayoutDashboard } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { editDepartmentSchema, emptyDepartmentValues } from './department-schema.js';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';

function StatsCards({ id }) {
    const [stats, setStats] = useState(null);
    useEffect(() => {
        getDepartmentStats(id).then(setStats).catch(() => {});
    }, [id]);
    if (!stats) return null;
    return (<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Programs</p><p className="text-2xl font-bold">{stats.program_count}</p></div>
      <div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Teachers</p><p className="text-2xl font-bold">{stats.teacher_count}</p></div>
      <div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Courses</p><p className="text-2xl font-bold">{stats.course_count}</p></div>
      <div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Students</p><p className="text-2xl font-bold">{stats.student_count}</p></div>
    </div>);
}

export function EditDepartment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(editDepartmentSchema),
        defaultValues: emptyDepartmentValues,
    });

    useEffect(() => {
        getFaculties({ pageSize: 200 })
            .then((result) => setFaculties(Array.isArray(result) ? result : []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!id) return;
        getDepartment(id)
            .then((data) => {
                if (!data) { setError('Department not found.'); return; }
                reset({
                    name: data.name || '',
                    code: data.code || '',
                    faculty_id: data.faculty_id || '',
                    established_date: data.established_date ? data.established_date.substring(0, 10) : '',
                    description: data.description || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    office_location: data.office_location || '',
                    vision: data.vision || '',
                    mission: data.mission || '',
                    hod_name: data.hod_name || '',
                    hod_email: data.hod_email || '',
                    hod_phone: data.hod_phone || '',
                    max_programs: data.max_programs ?? '',
                    max_teachers: data.max_teachers ?? '',
                    student_capacity: data.student_capacity ?? '',
                    facilities: data.facilities ? JSON.stringify(data.facilities) : '',
                    research_areas: data.research_areas ? JSON.stringify(data.research_areas) : '',
                    status: data.status || 'ACTIVE',
                });
            })
            .catch(() => setError('Failed to load department.'))
            .finally(() => setLoading(false));
    }, [id, reset]);

    async function onSubmit(values) {
        try {
            const payload = { ...values, faculty_id: Number(values.faculty_id), code: values.code.trim() || undefined, max_programs: values.max_programs || undefined, max_teachers: values.max_teachers || undefined, student_capacity: values.student_capacity || undefined, established_date: values.established_date || undefined, facilities: values.facilities || undefined, research_areas: values.research_areas || undefined, description: values.description || undefined, phone: values.phone || undefined, email: values.email || undefined, office_location: values.office_location || undefined, vision: values.vision || undefined, mission: values.mission || undefined, hod_name: values.hod_name || undefined, hod_email: values.hod_email || undefined, hod_phone: values.hod_phone || undefined };
            Object.keys(payload).forEach((k) => { if (payload[k] === '') payload[k] = undefined; });
            await updateDepartment(id, payload);
            toast.success('Department updated successfully.');
            navigate('/departments');
        } catch (err) {
            toast.error(err.message || 'Failed to update department.');
        }
    }

    if (loading) return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading department...</p></div>;
    if (error) return (<div className="space-y-4"><Alert variant="destructive"><AlertTitle>Department not found</AlertTitle><AlertDescription>{error}</AlertDescription></Alert><Button asChild variant="outline"><Link to="/departments">Back to departments</Link></Button></div>);

    return (<div className="space-y-6">
      <PageHeader title="Edit Department" description="Update the department record." />
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><LayoutDashboard className="size-4"/>Department Stats</CardTitle><CardDescription>Real-time counts for this department.</CardDescription></CardHeader>
        <CardContent><StatsCards id={id}/></CardContent>
      </Card>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Department name, code, faculty assignment, and status.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="name">Department Name *</Label><Input id="name" placeholder="e.g. Computer Science" {...register('name')} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldErrorId('name') : undefined}/><FieldError id={fieldErrorId('name')} message={errors.name?.message}/></div>
            <div className="space-y-2"><Label htmlFor="code">Department Code</Label><Input id="code" placeholder="e.g. cs" {...register('code')} disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="faculty_id">Faculty *</Label><select id="faculty_id" {...register('faculty_id')} disabled={isSubmitting} aria-invalid={Boolean(errors.faculty_id)} aria-describedby={errors.faculty_id ? fieldErrorId('faculty_id') : undefined} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="">Select Faculty</option>{faculties.filter((f) => f.status === 'ACTIVE').map((f) => (<option key={f.id} value={f.id}>{f.name} ({f.code})</option>))}</select><FieldError id={fieldErrorId('faculty_id')} message={errors.faculty_id?.message}/></div>
            <div className="space-y-2"><Label htmlFor="status">Status</Label><select id="status" {...register('status')} disabled={isSubmitting} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option><option value="CLOSED">Closed</option></select></div>
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Contact & Location</CardTitle><CardDescription>Department contact information and office location.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="email">Department Email</Label><Input id="email" type="email" placeholder="dept@university.edu" {...register('email')} disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" placeholder="+1-555-0123" {...register('phone')} disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="office_location">Office Location</Label><Input id="office_location" placeholder="e.g. Science Building, Room 301" {...register('office_location')} disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="established_date">Established Date</Label><Input id="established_date" type="date" {...register('established_date')} disabled={isSubmitting}/></div>
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Head of Department</CardTitle><CardDescription>Department head contact information.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="hod_name">HoD Name</Label><Input id="hod_name" placeholder="e.g. Dr. Jane Smith" {...register('hod_name')} disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="hod_email">HoD Email</Label><Input id="hod_email" type="email" placeholder="hod@university.edu" {...register('hod_email')} disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="hod_phone">HoD Phone</Label><Input id="hod_phone" placeholder="+1-555-0124" {...register('hod_phone')} disabled={isSubmitting}/></div>
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Vision & Mission</CardTitle><CardDescription>Department vision, mission, and description.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" rows={3} placeholder="Brief description of the department" {...register('description')} disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="vision">Vision</Label><Textarea id="vision" rows={3} placeholder="Department vision statement" {...register('vision')} disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="mission">Mission</Label><Textarea id="mission" rows={3} placeholder="Department mission statement" {...register('mission')} disabled={isSubmitting}/></div>
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Capacity Limits</CardTitle><CardDescription>Maximum limits for programs, teachers, and students.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="max_programs">Max Programs</Label><Input id="max_programs" type="number" min="1" placeholder="e.g. 10" {...register('max_programs')} disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="max_teachers">Max Teachers</Label><Input id="max_teachers" type="number" min="1" placeholder="e.g. 50" {...register('max_teachers')} disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="student_capacity">Student Capacity</Label><Input id="student_capacity" type="number" min="1" placeholder="e.g. 500" {...register('student_capacity')} disabled={isSubmitting}/></div>
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Facilities & Research</CardTitle><CardDescription>JSON fields for facilities and research areas.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="facilities">Facilities (JSON)</Label><Textarea id="facilities" rows={4} placeholder='[{"name":"Lab A","type":"Computer Lab"}]' {...register('facilities')} disabled={isSubmitting}/></div>
            <div className="space-y-2"><Label htmlFor="research_areas">Research Areas (JSON)</Label><Textarea id="research_areas" rows={4} placeholder='[{"name":"AI","focus":"Machine Learning"}]' {...register('research_areas')} disabled={isSubmitting}/></div>
          </div></CardContent>
        </Card>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button asChild type="button" variant="outline"><Link to="/departments">Cancel</Link></Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </div>);
}
