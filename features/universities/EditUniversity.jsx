import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from '@/lib/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getUniversity, updateUniversity, getUniversityStats } from '@/services/universities.service';
import { PageHeader } from '@/components/common/PageHeader';
import { editUniversitySchema, emptyUniversityValues } from './university-schema.js';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';

function StatsCard({ label, value }) {
    return (
        <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
}

export function EditUniversity() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(editUniversitySchema),
        defaultValues: emptyUniversityValues,
    });

    useEffect(() => {
        if (!id) return;
        Promise.all([
            getUniversity(id),
            getUniversityStats(id).catch(() => null),
        ])
            .then(([data, statsData]) => {
                if (!data) { setError('University not found.'); return; }
                reset({
                    name: data.name || '',
                    code: data.code || '',
                    type: data.type || 'PUBLIC',
                    established_date: data.established_date ? data.established_date.split('T')[0] : '',
                    accreditation_body: data.accreditation_body || '',
                    accreditation_status: data.accreditation_status || '',
                    accreditation_expiry: data.accreditation_expiry ? data.accreditation_expiry.split('T')[0] : '',
                    address: data.address || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    website: data.website || '',
                    timezone: data.timezone || 'UTC',
                    locale: data.locale || 'en',
                    currency: data.currency || 'USD',
                    logo_url: data.logo_url || '',
                    favicon_url: data.favicon_url || '',
                    primary_color: data.primary_color || '',
                    secondary_color: data.secondary_color || '',
                    contact_person_name: data.contact_person_name || '',
                    contact_person_email: data.contact_person_email || '',
                    contact_person_phone: data.contact_person_phone || '',
                    mission_statement: data.mission_statement || '',
                    vision_statement: data.vision_statement || '',
                    motto: data.motto || '',
                    max_campuses: data.max_campuses ?? '',
                    max_students: data.max_students ?? '',
                    status: data.status || 'ACTIVE',
                });
                setStats(statsData);
            })
            .catch(() => setError('Failed to load university.'))
            .finally(() => setLoading(false));
    }, [id, reset]);

    async function onSubmit(values) {
        try {
            const payload = {};
            for (const [key, value] of Object.entries(values)) {
                if (value !== '' && value !== undefined) payload[key] = value;
            }
            await updateUniversity(id, payload);
            toast.success('University updated successfully.');
            navigate('/universities');
        } catch (err) {
            toast.error(err.message || 'Failed to update university.');
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading university...</p></div>;
    }
    if (error) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/universities">Back to universities</Link>
        </Button>
      </div>);
    }

    return (<div className="space-y-6">
      <PageHeader title="Edit University" description="Update the university record and manage settings." />

      {stats && (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatsCard label="Campuses" value={stats.campus_count} />
          <StatsCard label="Faculties" value={stats.faculty_count} />
          <StatsCard label="Departments" value={stats.department_count} />
          <StatsCard label="Programs" value={stats.program_count} />
          <StatsCard label="Students" value={stats.student_count} />
          <StatsCard label="Teachers" value={stats.teacher_count} />
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>University identity and classification.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">University Name *</Label>
              <Input id="name" placeholder="e.g. Harvard University" {...register('name')} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldErrorId('name') : undefined}/>
              <FieldError id={fieldErrorId('name')} message={errors.name?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g. HARV" {...register('code')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select id="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register('type')} disabled={isSubmitting}>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
                <option value="CHARTERED">Chartered</option>
                <option value="FAITH_BASED">Faith-Based</option>
                <option value="OTHER">Other</option>
              </select>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Accreditation</CardTitle><CardDescription>Accreditation body and status.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="accreditation_body">Accreditation Body</Label>
              <Input id="accreditation_body" placeholder="e.g. HEC, ABET" {...register('accreditation_body')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accreditation_status">Accreditation Status</Label>
              <Input id="accreditation_status" placeholder="e.g. Accredited, Provisional" {...register('accreditation_status')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accreditation_expiry">Accreditation Expiry</Label>
              <Input id="accreditation_expiry" type="date" {...register('accreditation_expiry')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle><CardDescription>Address, phone, email, and website.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="e.g. 123 University Ave, Cambridge, MA" {...register('address')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="e.g. +1 617-555-1234" {...register('phone')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="e.g. info@university.edu" {...register('email')} disabled={isSubmitting} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? fieldErrorId('email') : undefined}/>
              <FieldError id={fieldErrorId('email')} message={errors.email?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="e.g. https://www.harvard.edu" {...register('website')} disabled={isSubmitting} aria-invalid={Boolean(errors.website)} aria-describedby={errors.website ? fieldErrorId('website') : undefined}/>
              <FieldError id={fieldErrorId('website')} message={errors.website?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" placeholder="e.g. UTC, America/New_York" {...register('timezone')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <Input id="locale" placeholder="e.g. en, fr, ar" {...register('locale')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" placeholder="e.g. USD, EUR, GBP" {...register('currency')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Branding</CardTitle><CardDescription>Visual identity and branding assets.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input id="logo_url" placeholder="https://..." {...register('logo_url')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon_url">Favicon URL</Label>
              <Input id="favicon_url" placeholder="https://..." {...register('favicon_url')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <Input id="primary_color" placeholder="e.g. #A51C30" {...register('primary_color')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <Input id="secondary_color" placeholder="e.g. #C3A456" {...register('secondary_color')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Person</CardTitle><CardDescription>Primary contact person details.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="contact_person_name">Name</Label>
              <Input id="contact_person_name" placeholder="e.g. Dr. Jane Smith" {...register('contact_person_name')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person_email">Email</Label>
              <Input id="contact_person_email" type="email" placeholder="e.g. president@university.edu" {...register('contact_person_email')} disabled={isSubmitting} aria-invalid={Boolean(errors.contact_person_email)} aria-describedby={errors.contact_person_email ? fieldErrorId('contact_person_email') : undefined}/>
              <FieldError id={fieldErrorId('contact_person_email')} message={errors.contact_person_email?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person_phone">Phone</Label>
              <Input id="contact_person_phone" placeholder="e.g. +1 617-555-5678" {...register('contact_person_phone')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Mission & Vision</CardTitle><CardDescription>University identity statements.</CardDescription></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="motto">Motto</Label>
              <Input id="motto" placeholder="e.g. Veritas (Truth)" {...register('motto')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mission_statement">Mission Statement</Label>
              <Textarea id="mission_statement" placeholder="Enter the university's mission statement..." {...register('mission_statement')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vision_statement">Vision Statement</Label>
              <Textarea id="vision_statement" placeholder="Enter the university's vision statement..." {...register('vision_statement')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Limits</CardTitle><CardDescription>Capacity and scaling limits.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="max_campuses">Max Campuses</Label>
              <Input id="max_campuses" type="number" min="1" placeholder="e.g. 10" {...register('max_campuses')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_students">Max Students</Label>
              <Input id="max_students" type="number" min="1" placeholder="e.g. 100000" {...register('max_students')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button asChild type="button" variant="outline">
            <Link to="/universities">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>);
}
