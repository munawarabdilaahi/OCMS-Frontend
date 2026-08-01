import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getUniversity, updateUniversity, getUniversityStats } from '@/services/universities.service';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

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
    const [form, setForm] = useState({
        name: '', code: '', type: 'PUBLIC', established_date: '',
        accreditation_body: '', accreditation_status: '', accreditation_expiry: '',
        address: '', phone: '', email: '', website: '',
        timezone: 'UTC', locale: 'en', currency: 'USD',
        logo_url: '', favicon_url: '', primary_color: '', secondary_color: '',
        contact_person_name: '', contact_person_email: '', contact_person_phone: '',
        mission_statement: '', vision_statement: '', motto: '',
        max_campuses: '', max_students: '', status: 'ACTIVE',
    });
    const [stats, setStats] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        Promise.all([
            getUniversity(id),
            getUniversityStats(id).catch(() => null),
        ])
            .then(([data, statsData]) => {
                if (!data) { setError('University not found.'); return; }
                setForm({
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
    }, [id]);

    function set(field, value) {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((p) => ({ ...p, [field]: undefined }));
    }

    function validate() {
        const errs = {};
        if (!form.name.trim()) errs.name = 'University name is required.';
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format.';
        if (form.website && !/^https?:\/\/.+/.test(form.website)) errs.website = 'Website must start with http:// or https://.';
        if (form.contact_person_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_person_email)) errs.contact_person_email = 'Invalid contact person email format.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const payload = {};
            for (const [key, value] of Object.entries(form)) {
                if (value !== '' && value !== undefined) payload[key] = value;
            }
            await updateUniversity(id, payload);
            toast.success('University updated successfully.');
            navigate('/universities');
        } catch (err) {
            toast.error(err.message || 'Failed to update university.');
            setIsSubmitting(false);
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
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Edit University</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update the university record and manage settings.</p>
      </div>

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

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>University identity and classification.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">University Name *</Label>
              <Input id="name" placeholder="e.g. Harvard University" value={form.name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(e) => set('name', e.target.value)}/>
              <FieldError message={errors.name}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g. HARV" value={form.code} disabled={isSubmitting} onChange={(e) => set('code', e.target.value.toUpperCase())}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select id="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} disabled={isSubmitting} onChange={(e) => set('type', e.target.value)}>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
                <option value="CHARTERED">Chartered</option>
                <option value="FAITH_BASED">Faith-Based</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="established_date">Established Date</Label>
              <Input id="established_date" type="date" value={form.established_date} disabled={isSubmitting} onChange={(e) => set('established_date', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} disabled={isSubmitting} onChange={(e) => set('status', e.target.value)}>
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
              <Input id="accreditation_body" placeholder="e.g. HEC, ABET" value={form.accreditation_body} disabled={isSubmitting} onChange={(e) => set('accreditation_body', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accreditation_status">Accreditation Status</Label>
              <Input id="accreditation_status" placeholder="e.g. Accredited, Provisional" value={form.accreditation_status} disabled={isSubmitting} onChange={(e) => set('accreditation_status', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accreditation_expiry">Accreditation Expiry</Label>
              <Input id="accreditation_expiry" type="date" value={form.accreditation_expiry} disabled={isSubmitting} onChange={(e) => set('accreditation_expiry', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle><CardDescription>Address, phone, email, and website.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="e.g. 123 University Ave, Cambridge, MA" value={form.address} disabled={isSubmitting} onChange={(e) => set('address', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="e.g. +1 617-555-1234" value={form.phone} disabled={isSubmitting} onChange={(e) => set('phone', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="e.g. info@university.edu" value={form.email} disabled={isSubmitting} aria-invalid={Boolean(errors.email)} onChange={(e) => set('email', e.target.value)}/>
              <FieldError message={errors.email}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="e.g. https://www.harvard.edu" value={form.website} disabled={isSubmitting} aria-invalid={Boolean(errors.website)} onChange={(e) => set('website', e.target.value)}/>
              <FieldError message={errors.website}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" placeholder="e.g. UTC, America/New_York" value={form.timezone} disabled={isSubmitting} onChange={(e) => set('timezone', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <Input id="locale" placeholder="e.g. en, fr, ar" value={form.locale} disabled={isSubmitting} onChange={(e) => set('locale', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" placeholder="e.g. USD, EUR, GBP" value={form.currency} disabled={isSubmitting} onChange={(e) => set('currency', e.target.value.toUpperCase())}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Branding</CardTitle><CardDescription>Visual identity and branding assets.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input id="logo_url" placeholder="https://..." value={form.logo_url} disabled={isSubmitting} onChange={(e) => set('logo_url', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon_url">Favicon URL</Label>
              <Input id="favicon_url" placeholder="https://..." value={form.favicon_url} disabled={isSubmitting} onChange={(e) => set('favicon_url', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <Input id="primary_color" placeholder="e.g. #A51C30" value={form.primary_color} disabled={isSubmitting} onChange={(e) => set('primary_color', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <Input id="secondary_color" placeholder="e.g. #C3A456" value={form.secondary_color} disabled={isSubmitting} onChange={(e) => set('secondary_color', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Person</CardTitle><CardDescription>Primary contact person details.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="contact_person_name">Name</Label>
              <Input id="contact_person_name" placeholder="e.g. Dr. Jane Smith" value={form.contact_person_name} disabled={isSubmitting} onChange={(e) => set('contact_person_name', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person_email">Email</Label>
              <Input id="contact_person_email" type="email" placeholder="e.g. president@university.edu" value={form.contact_person_email} disabled={isSubmitting} aria-invalid={Boolean(errors.contact_person_email)} onChange={(e) => set('contact_person_email', e.target.value)}/>
              <FieldError message={errors.contact_person_email}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person_phone">Phone</Label>
              <Input id="contact_person_phone" placeholder="e.g. +1 617-555-5678" value={form.contact_person_phone} disabled={isSubmitting} onChange={(e) => set('contact_person_phone', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Mission & Vision</CardTitle><CardDescription>University identity statements.</CardDescription></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="motto">Motto</Label>
              <Input id="motto" placeholder="e.g. Veritas (Truth)" value={form.motto} disabled={isSubmitting} onChange={(e) => set('motto', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mission_statement">Mission Statement</Label>
              <Textarea id="mission_statement" placeholder="Enter the university's mission statement..." value={form.mission_statement} disabled={isSubmitting} onChange={(e) => set('mission_statement', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vision_statement">Vision Statement</Label>
              <Textarea id="vision_statement" placeholder="Enter the university's vision statement..." value={form.vision_statement} disabled={isSubmitting} onChange={(e) => set('vision_statement', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Limits</CardTitle><CardDescription>Capacity and scaling limits.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="max_campuses">Max Campuses</Label>
              <Input id="max_campuses" type="number" min="1" placeholder="e.g. 10" value={form.max_campuses} disabled={isSubmitting} onChange={(e) => set('max_campuses', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_students">Max Students</Label>
              <Input id="max_students" type="number" min="1" placeholder="e.g. 100000" value={form.max_students} disabled={isSubmitting} onChange={(e) => set('max_students', e.target.value)}/>
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
