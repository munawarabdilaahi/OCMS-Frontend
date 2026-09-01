import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from '@/lib/router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCampuses } from '@/services/campus.service';
import { getFaculty, updateFaculty, getFacultyStats } from '@/services/faculties.service';
import { PageHeader } from '@/components/common/PageHeader';
import { editFacultySchema, emptyFacultyValues } from './faculty-schema.js';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';

function StatsCard({ label, value }) {
    return (
        <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
}

export function EditFaculty() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campuses, setCampuses] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(editFacultySchema),
        defaultValues: emptyFacultyValues,
    });

    useEffect(() => {
        getCampuses()
            .then((data) => { if (Array.isArray(data)) setCampuses(data); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            getFaculty(id),
            getFacultyStats(id).catch(() => null),
        ])
            .then(([data, statsData]) => {
                if (!data) { setError('Faculty not found.'); return; }
                reset({
                    name: data.name || '',
                    code: data.code || '',
                    established_date: data.established_date ? data.established_date.split('T')[0] : '',
                    description: data.description || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    website: data.website || '',
                    dean_name: data.dean_name || '',
                    dean_email: data.dean_email || '',
                    dean_phone: data.dean_phone || '',
                    office_location: data.office_location || '',
                    office_hours: data.office_hours || '',
                    vision: data.vision || '',
                    mission: data.mission || '',
                    accreditation_body: data.accreditation_body || '',
                    accreditation_status: data.accreditation_status || '',
                    accreditation_expiry: data.accreditation_expiry ? data.accreditation_expiry.split('T')[0] : '',
                    max_departments: data.max_departments ?? '',
                    student_capacity: data.student_capacity ?? '',
                    facilities: data.facilities ? (typeof data.facilities === 'object' ? JSON.stringify(data.facilities, null, 2) : data.facilities) : '',
                    research_areas: data.research_areas ? (typeof data.research_areas === 'object' ? JSON.stringify(data.research_areas, null, 2) : data.research_areas) : '',
                    campus_id: data.campus_id?.toString() || '',
                    status: data.status || 'ACTIVE',
                });
                setStats(statsData);
            })
            .catch(() => setError('Failed to load faculty.'))
            .finally(() => setLoading(false));
    }, [id, reset]);

    async function onSubmit(values) {
        try {
            const payload = { campus_id: Number(values.campus_id) };
            for (const [key, value] of Object.entries(values)) {
                if (key === 'campus_id') continue;
                if (value !== '' && value !== undefined) payload[key] = value;
            }
            await updateFaculty(id, payload);
            toast.success('Faculty updated successfully.');
            navigate('/faculties');
        } catch (err) {
            toast.error(err.message || 'Failed to update faculty.');
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading faculty...</p></div>;
    }
    if (error) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/faculties">Back to faculties</Link>
        </Button>
      </div>);
    }

    return (<div className="space-y-6">
      <PageHeader title="Edit Faculty" description="Update the faculty record and manage settings." />

      {stats && (
        <div className="grid gap-3 sm:grid-cols-4">
          <StatsCard label="Departments" value={stats.department_count} />
          <StatsCard label="Programs" value={stats.program_count} />
          <StatsCard label="Students" value={stats.student_count} />
          <StatsCard label="Teachers" value={stats.teacher_count} />
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Faculty identity and classification.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Faculty Name *</Label>
              <Input id="name" placeholder="e.g. Faculty of Science" {...register('name')} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldErrorId('name') : undefined}/>
              <FieldError id={fieldErrorId('name')} message={errors.name?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g. SCI" {...register('code')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="established_date">Established Date</Label>
              <Input id="established_date" type="date" {...register('established_date')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register('status')} disabled={isSubmitting}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Campus *</Label>
              <Controller
                control={control}
                name="campus_id"
                render={({ field }) => (
                  <Select value={field.value} disabled={isSubmitting} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={Boolean(errors.campus_id)} aria-describedby={errors.campus_id ? fieldErrorId('campus_id') : undefined}><SelectValue placeholder="Select a campus..."/></SelectTrigger>
                    <SelectContent>
                      {campuses.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.name} ({c.code})</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError id={fieldErrorId('campus_id')} message={errors.campus_id?.message}/>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Brief description of the faculty..." {...register('description')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle><CardDescription>Phone, email, website, and location.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="e.g. +1 617-555-1234" {...register('phone')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="e.g. science@university.edu" {...register('email')} disabled={isSubmitting} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? fieldErrorId('email') : undefined}/>
              <FieldError id={fieldErrorId('email')} message={errors.email?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="e.g. https://science.university.edu" {...register('website')} disabled={isSubmitting} aria-invalid={Boolean(errors.website)} aria-describedby={errors.website ? fieldErrorId('website') : undefined}/>
              <FieldError id={fieldErrorId('website')} message={errors.website?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="office_location">Office Location</Label>
              <Input id="office_location" placeholder="e.g. Science Block, Room 201" {...register('office_location')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="office_hours">Office Hours</Label>
              <Input id="office_hours" placeholder="e.g. Mon-Fri 9:00-17:00" {...register('office_hours')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Dean Information</CardTitle><CardDescription>Faculty leadership details.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dean_name">Dean Name</Label>
              <Input id="dean_name" placeholder="e.g. Prof. Jane Doe" {...register('dean_name')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dean_email">Dean Email</Label>
              <Input id="dean_email" type="email" placeholder="e.g. dean@science.edu" {...register('dean_email')} disabled={isSubmitting} aria-invalid={Boolean(errors.dean_email)} aria-describedby={errors.dean_email ? fieldErrorId('dean_email') : undefined}/>
              <FieldError id={fieldErrorId('dean_email')} message={errors.dean_email?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dean_phone">Dean Phone</Label>
              <Input id="dean_phone" placeholder="e.g. +1 617-555-5678" {...register('dean_phone')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Vision & Mission</CardTitle><CardDescription>Faculty identity statements.</CardDescription></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="vision">Vision</Label>
              <Textarea id="vision" placeholder="Faculty vision statement..." {...register('vision')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mission">Mission</Label>
              <Textarea id="mission" placeholder="Faculty mission statement..." {...register('mission')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Accreditation</CardTitle><CardDescription>Accreditation body and status.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="accreditation_body">Accreditation Body</Label>
              <Input id="accreditation_body" placeholder="e.g. ABET" {...register('accreditation_body')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accreditation_status">Accreditation Status</Label>
              <Input id="accreditation_status" placeholder="e.g. Accredited" {...register('accreditation_status')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accreditation_expiry">Accreditation Expiry</Label>
              <Input id="accreditation_expiry" type="date" {...register('accreditation_expiry')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Capacity & Limits</CardTitle><CardDescription>Department and student capacity limits.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="max_departments">Max Departments</Label>
              <Input id="max_departments" type="number" min="1" placeholder="e.g. 15" {...register('max_departments')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="student_capacity">Student Capacity</Label>
              <Input id="student_capacity" type="number" min="1" placeholder="e.g. 5000" {...register('student_capacity')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Settings & Notes</CardTitle><CardDescription>Additional faculty configuration.</CardDescription></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="facilities">Facilities (JSON)</Label>
              <Textarea id="facilities" placeholder='e.g. {"labs": 20, "lecture_halls": 15}' {...register('facilities')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="research_areas">Research Areas (JSON)</Label>
              <Textarea id="research_areas" placeholder='e.g. ["AI", "Biotechnology", "Climate Change"]' {...register('research_areas')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button asChild type="button" variant="outline">
            <Link to="/faculties">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>);
}