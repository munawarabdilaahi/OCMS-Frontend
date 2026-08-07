import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createDepartment } from '@/services/departments.service';
import { getFaculties } from '@/services/faculties.service';
import { PageHeader } from '@/components/common/PageHeader';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

export function AddDepartment() {
    const navigate = useNavigate();
    const [faculties, setFaculties] = useState([]);
    const [form, setForm] = useState({ name: '', code: '', faculty_id: '', established_date: '', description: '', phone: '', email: '', office_location: '', vision: '', mission: '', hod_name: '', hod_email: '', hod_phone: '', max_programs: '', max_teachers: '', student_capacity: '', facilities: '', research_areas: '', status: 'ACTIVE' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getFaculties({ pageSize: 200 })
            .then((result) => setFaculties(Array.isArray(result) ? result : []))
            .catch(() => toast.error('Failed to load faculties.'));
    }, []);

    function set(field) {
        return (e) => { setForm((p) => ({ ...p, [field]: e.target.value })); setErrors((p) => ({ ...p, [field]: undefined })); };
    }

    function validate() {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Department name is required.';
        if (!form.faculty_id) errs.faculty_id = 'Faculty is required.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const payload = { ...form, faculty_id: Number(form.faculty_id), code: form.code.trim() || undefined, max_programs: form.max_programs || undefined, max_teachers: form.max_teachers || undefined, student_capacity: form.student_capacity || undefined, established_date: form.established_date || undefined, facilities: form.facilities || undefined, research_areas: form.research_areas || undefined, description: form.description || undefined, phone: form.phone || undefined, email: form.email || undefined, office_location: form.office_location || undefined, vision: form.vision || undefined, mission: form.mission || undefined, hod_name: form.hod_name || undefined, hod_email: form.hod_email || undefined, hod_phone: form.hod_phone || undefined };
            Object.keys(payload).forEach((k) => { if (payload[k] === '') payload[k] = undefined; });
            await createDepartment(payload);
            toast.success('Department created successfully.');
            navigate('/departments');
        } catch (err) {
            toast.error(err.message || 'Failed to create department.');
            setIsSubmitting(false);
        }
    }

    return (<div className="space-y-6">
      <PageHeader title="Add Department" description="Create a new academic department record." />
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Department name, code, faculty assignment, and status.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="name">Department Name *</Label><Input id="name" placeholder="e.g. Computer Science" value={form.name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={set('name')}/><FieldError message={errors.name}/></div>
            <div className="space-y-2"><Label htmlFor="code">Department Code</Label><Input id="code" placeholder="e.g. cs" value={form.code} disabled={isSubmitting} onChange={set('code')}/></div>
            <div className="space-y-2"><Label htmlFor="faculty_id">Faculty *</Label><select id="faculty_id" value={form.faculty_id} disabled={isSubmitting} aria-invalid={Boolean(errors.faculty_id)} onChange={set('faculty_id')} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="">Select Faculty</option>{faculties.filter((f) => f.status === 'ACTIVE').map((f) => (<option key={f.id} value={f.id}>{f.name} ({f.code})</option>))}</select><FieldError message={errors.faculty_id}/></div>
            <div className="space-y-2"><Label htmlFor="status">Status</Label><select id="status" value={form.status} disabled={isSubmitting} onChange={set('status')} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option><option value="CLOSED">Closed</option></select></div>
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Contact & Location</CardTitle><CardDescription>Department contact information and office location.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="email">Department Email</Label><Input id="email" type="email" placeholder="dept@university.edu" value={form.email} disabled={isSubmitting} onChange={set('email')}/></div>
            <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" placeholder="+1-555-0123" value={form.phone} disabled={isSubmitting} onChange={set('phone')}/></div>
            <div className="space-y-2"><Label htmlFor="office_location">Office Location</Label><Input id="office_location" placeholder="e.g. Science Building, Room 301" value={form.office_location} disabled={isSubmitting} onChange={set('office_location')}/></div>
            <div className="space-y-2"><Label htmlFor="established_date">Established Date</Label><Input id="established_date" type="date" value={form.established_date} disabled={isSubmitting} onChange={set('established_date')}/></div>
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Head of Department</CardTitle><CardDescription>Department head contact information.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="hod_name">HoD Name</Label><Input id="hod_name" placeholder="e.g. Dr. Jane Smith" value={form.hod_name} disabled={isSubmitting} onChange={set('hod_name')}/></div>
            <div className="space-y-2"><Label htmlFor="hod_email">HoD Email</Label><Input id="hod_email" type="email" placeholder="hod@university.edu" value={form.hod_email} disabled={isSubmitting} onChange={set('hod_email')}/></div>
            <div className="space-y-2"><Label htmlFor="hod_phone">HoD Phone</Label><Input id="hod_phone" placeholder="+1-555-0124" value={form.hod_phone} disabled={isSubmitting} onChange={set('hod_phone')}/></div>
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Vision & Mission</CardTitle><CardDescription>Department vision, mission, and description.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" rows={3} placeholder="Brief description of the department" value={form.description} disabled={isSubmitting} onChange={set('description')}/></div>
            <div className="space-y-2"><Label htmlFor="vision">Vision</Label><Textarea id="vision" rows={3} placeholder="Department vision statement" value={form.vision} disabled={isSubmitting} onChange={set('vision')}/></div>
            <div className="space-y-2"><Label htmlFor="mission">Mission</Label><Textarea id="mission" rows={3} placeholder="Department mission statement" value={form.mission} disabled={isSubmitting} onChange={set('mission')}/></div>
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Capacity Limits</CardTitle><CardDescription>Maximum limits for programs, teachers, and students.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="max_programs">Max Programs</Label><Input id="max_programs" type="number" min="1" placeholder="e.g. 10" value={form.max_programs} disabled={isSubmitting} onChange={set('max_programs')}/></div>
            <div className="space-y-2"><Label htmlFor="max_teachers">Max Teachers</Label><Input id="max_teachers" type="number" min="1" placeholder="e.g. 50" value={form.max_teachers} disabled={isSubmitting} onChange={set('max_teachers')}/></div>
            <div className="space-y-2"><Label htmlFor="student_capacity">Student Capacity</Label><Input id="student_capacity" type="number" min="1" placeholder="e.g. 500" value={form.student_capacity} disabled={isSubmitting} onChange={set('student_capacity')}/></div>
          </div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Facilities & Research</CardTitle><CardDescription>JSON fields for facilities and research areas.</CardDescription></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="facilities">Facilities (JSON)</Label><Textarea id="facilities" rows={4} placeholder='[{"name":"Lab A","type":"Computer Lab"}]' value={form.facilities} disabled={isSubmitting} onChange={set('facilities')}/></div>
            <div className="space-y-2"><Label htmlFor="research_areas">Research Areas (JSON)</Label><Textarea id="research_areas" rows={4} placeholder='[{"name":"AI","focus":"Machine Learning"}]' value={form.research_areas} disabled={isSubmitting} onChange={set('research_areas')}/></div>
          </div></CardContent>
        </Card>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button asChild type="button" variant="outline"><Link to="/departments">Cancel</Link></Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Department'}</Button>
        </div>
      </form>
    </div>);
}
