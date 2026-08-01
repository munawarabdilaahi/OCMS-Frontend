import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCampuses } from '@/services/campus.service';
import { createFaculty } from '@/services/faculties.service';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

export function AddFaculty() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', code: '', established_date: '',
        description: '', phone: '', email: '', website: '',
        dean_name: '', dean_email: '', dean_phone: '',
        office_location: '', office_hours: '',
        vision: '', mission: '',
        accreditation_body: '', accreditation_status: '', accreditation_expiry: '',
        max_departments: '', student_capacity: '',
        facilities: '', research_areas: '',
        campus_id: '',
    });
    const [campuses, setCampuses] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getCampuses()
            .then((data) => { if (Array.isArray(data)) setCampuses(data); })
            .catch(() => {});
    }, []);

    function set(field, value) {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((p) => ({ ...p, [field]: undefined }));
    }

    function validate() {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Faculty name is required.';
        if (!form.campus_id) errs.campus_id = 'Campus is required.';
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format.';
        if (form.website && !/^https?:\/\/.+/.test(form.website)) errs.website = 'Website must start with http:// or https://.';
        if (form.dean_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.dean_email)) errs.dean_email = 'Invalid email format.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const payload = { campus_id: Number(form.campus_id) };
            for (const [key, value] of Object.entries(form)) {
                if (key === 'campus_id') continue;
                if (value !== '' && value !== undefined) payload[key] = value;
            }
            await createFaculty(payload);
            toast.success('Faculty created successfully.');
            navigate('/faculties');
        } catch (err) {
            toast.error(err.message || 'Failed to create faculty.');
            setIsSubmitting(false);
        }
    }

    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Add Faculty</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new faculty record with full enterprise details.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Faculty identity and classification.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Faculty Name *</Label>
              <Input id="name" placeholder="e.g. Faculty of Science" value={form.name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(e) => set('name', e.target.value)}/>
              <FieldError message={errors.name}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g. SCI (auto-generated)" value={form.code} disabled={isSubmitting} onChange={(e) => set('code', e.target.value.toUpperCase())}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="established_date">Established Date</Label>
              <Input id="established_date" type="date" value={form.established_date} disabled={isSubmitting} onChange={(e) => set('established_date', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label>Campus *</Label>
              <Select value={form.campus_id} disabled={isSubmitting} onValueChange={(v) => set('campus_id', v)}>
                <SelectTrigger aria-invalid={Boolean(errors.campus_id)}><SelectValue placeholder="Select a campus..."/></SelectTrigger>
                <SelectContent>
                  {campuses.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.name} ({c.code})</SelectItem>))}
                </SelectContent>
              </Select>
              <FieldError message={errors.campus_id}/>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Brief description of the faculty..." value={form.description} disabled={isSubmitting} onChange={(e) => set('description', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle><CardDescription>Phone, email, website, and location.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="e.g. +1 617-555-1234" value={form.phone} disabled={isSubmitting} onChange={(e) => set('phone', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="e.g. science@university.edu" value={form.email} disabled={isSubmitting} aria-invalid={Boolean(errors.email)} onChange={(e) => set('email', e.target.value)}/>
              <FieldError message={errors.email}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="e.g. https://science.university.edu" value={form.website} disabled={isSubmitting} aria-invalid={Boolean(errors.website)} onChange={(e) => set('website', e.target.value)}/>
              <FieldError message={errors.website}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="office_location">Office Location</Label>
              <Input id="office_location" placeholder="e.g. Science Block, Room 201" value={form.office_location} disabled={isSubmitting} onChange={(e) => set('office_location', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="office_hours">Office Hours</Label>
              <Input id="office_hours" placeholder="e.g. Mon-Fri 9:00-17:00" value={form.office_hours} disabled={isSubmitting} onChange={(e) => set('office_hours', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Dean Information</CardTitle><CardDescription>Faculty leadership details.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dean_name">Dean Name</Label>
              <Input id="dean_name" placeholder="e.g. Prof. Jane Doe" value={form.dean_name} disabled={isSubmitting} onChange={(e) => set('dean_name', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dean_email">Dean Email</Label>
              <Input id="dean_email" type="email" placeholder="e.g. dean@science.edu" value={form.dean_email} disabled={isSubmitting} aria-invalid={Boolean(errors.dean_email)} onChange={(e) => set('dean_email', e.target.value)}/>
              <FieldError message={errors.dean_email}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dean_phone">Dean Phone</Label>
              <Input id="dean_phone" placeholder="e.g. +1 617-555-5678" value={form.dean_phone} disabled={isSubmitting} onChange={(e) => set('dean_phone', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Vision & Mission</CardTitle><CardDescription>Faculty identity statements.</CardDescription></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="vision">Vision</Label>
              <Textarea id="vision" placeholder="Faculty vision statement..." value={form.vision} disabled={isSubmitting} onChange={(e) => set('vision', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mission">Mission</Label>
              <Textarea id="mission" placeholder="Faculty mission statement..." value={form.mission} disabled={isSubmitting} onChange={(e) => set('mission', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Accreditation</CardTitle><CardDescription>Accreditation body and status.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="accreditation_body">Accreditation Body</Label>
              <Input id="accreditation_body" placeholder="e.g. ABET" value={form.accreditation_body} disabled={isSubmitting} onChange={(e) => set('accreditation_body', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accreditation_status">Accreditation Status</Label>
              <Input id="accreditation_status" placeholder="e.g. Accredited" value={form.accreditation_status} disabled={isSubmitting} onChange={(e) => set('accreditation_status', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accreditation_expiry">Accreditation Expiry</Label>
              <Input id="accreditation_expiry" type="date" value={form.accreditation_expiry} disabled={isSubmitting} onChange={(e) => set('accreditation_expiry', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Capacity & Limits</CardTitle><CardDescription>Department and student capacity limits.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="max_departments">Max Departments</Label>
              <Input id="max_departments" type="number" min="1" placeholder="e.g. 15" value={form.max_departments} disabled={isSubmitting} onChange={(e) => set('max_departments', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="student_capacity">Student Capacity</Label>
              <Input id="student_capacity" type="number" min="1" placeholder="e.g. 5000" value={form.student_capacity} disabled={isSubmitting} onChange={(e) => set('student_capacity', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Settings & Notes</CardTitle><CardDescription>Additional faculty configuration.</CardDescription></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="facilities">Facilities (JSON)</Label>
              <Textarea id="facilities" placeholder='e.g. {"labs": 20, "lecture_halls": 15}' value={form.facilities} disabled={isSubmitting} onChange={(e) => set('facilities', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="research_areas">Research Areas (JSON)</Label>
              <Textarea id="research_areas" placeholder='e.g. ["AI", "Biotechnology", "Climate Change"]' value={form.research_areas} disabled={isSubmitting} onChange={(e) => set('research_areas', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button asChild type="button" variant="outline">
            <Link to="/faculties">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Faculty'}
          </Button>
        </div>
      </form>
    </div>);
}