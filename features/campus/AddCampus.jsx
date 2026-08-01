import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUniversities } from '@/services/universities.service';
import { createCampus } from '@/services/campus.service';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

export function AddCampus() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', code: '', type: 'MAIN', established_date: '',
        address: '', phone: '', email: '', website: '',
        timezone: '', locale: '', currency: '',
        campus_director: '', director_email: '', director_phone: '',
        max_capacity: '', accreditation_body: '', accreditation_status: '', accreditation_expiry: '',
        operating_hours: '', emergency_contact: '', emergency_phone: '',
        campus_size: '', buildings_count: '', virtual_campus_url: '',
        parking_capacity: '', library_hours: '', cafeteria_count: '',
        medical_facilities: '', security_details: '',
        facilities: '', transport_routes: '', sports_facilities: '',
        university_id: '',
    });
    const [universities, setUniversities] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getUniversities()
            .then((data) => { if (Array.isArray(data)) setUniversities(data); })
            .catch(() => toast.error('Failed to load form data.'));
    }, []);

    function set(field, value) {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((p) => ({ ...p, [field]: undefined }));
    }

    function validate() {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Campus name is required.';
        if (!form.university_id) errs.university_id = 'University is required.';
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format.';
        if (form.website && !/^https?:\/\/.+/.test(form.website)) errs.website = 'Website must start with http:// or https://.';
        if (form.director_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.director_email)) errs.director_email = 'Invalid email format.';
        if (form.virtual_campus_url && !/^https?:\/\/.+/.test(form.virtual_campus_url)) errs.virtual_campus_url = 'URL must start with http:// or https://.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const payload = { university_id: Number(form.university_id) };
            for (const [key, value] of Object.entries(form)) {
                if (key === 'university_id') continue;
                if (value !== '' && value !== undefined) payload[key] = value;
            }
            await createCampus(payload);
            toast.success('Campus created successfully.');
            navigate('/campus');
        } catch (err) {
            toast.error(err.message || 'Failed to create campus.');
            setIsSubmitting(false);
        }
    }

    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Add Campus</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new campus record with full enterprise details.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Campus identity and classification.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Campus Name *</Label>
              <Input id="name" placeholder="e.g. Main Campus" value={form.name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(e) => set('name', e.target.value)}/>
              <FieldError message={errors.name}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g. MAIN (auto-generated if empty)" value={form.code} disabled={isSubmitting} onChange={(e) => set('code', e.target.value.toUpperCase())}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select id="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} disabled={isSubmitting} onChange={(e) => set('type', e.target.value)}>
                <option value="MAIN">Main</option>
                <option value="BRANCH">Branch</option>
                <option value="VIRTUAL">Virtual</option>
                <option value="SATELLITE">Satellite</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="established_date">Established Date</Label>
              <Input id="established_date" type="date" value={form.established_date} disabled={isSubmitting} onChange={(e) => set('established_date', e.target.value)}/>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>University *</Label>
              <Select value={form.university_id} disabled={isSubmitting} onValueChange={(v) => set('university_id', v)}>
                <SelectTrigger aria-invalid={Boolean(errors.university_id)}><SelectValue placeholder="Select a university..."/></SelectTrigger>
                <SelectContent>
                  {universities.map((u) => (<SelectItem key={u.id} value={String(u.id)}>{u.name} ({u.code})</SelectItem>))}
                </SelectContent>
              </Select>
              <FieldError message={errors.university_id}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle><CardDescription>Address, phone, email, and website.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="e.g. 456 College St, Boston, MA" value={form.address} disabled={isSubmitting} onChange={(e) => set('address', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="e.g. +1 617-555-1234" value={form.phone} disabled={isSubmitting} onChange={(e) => set('phone', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="e.g. campus@university.edu" value={form.email} disabled={isSubmitting} aria-invalid={Boolean(errors.email)} onChange={(e) => set('email', e.target.value)}/>
              <FieldError message={errors.email}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="e.g. https://campus.university.edu" value={form.website} disabled={isSubmitting} aria-invalid={Boolean(errors.website)} onChange={(e) => set('website', e.target.value)}/>
              <FieldError message={errors.website}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" placeholder="e.g. America/New_York" value={form.timezone} disabled={isSubmitting} onChange={(e) => set('timezone', e.target.value)}/>
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
          <CardHeader><CardTitle>Campus Director</CardTitle><CardDescription>Primary leadership contact.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="campus_director">Director Name</Label>
              <Input id="campus_director" placeholder="e.g. Dr. John Smith" value={form.campus_director} disabled={isSubmitting} onChange={(e) => set('campus_director', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="director_email">Director Email</Label>
              <Input id="director_email" type="email" placeholder="e.g. director@campus.edu" value={form.director_email} disabled={isSubmitting} aria-invalid={Boolean(errors.director_email)} onChange={(e) => set('director_email', e.target.value)}/>
              <FieldError message={errors.director_email}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="director_phone">Director Phone</Label>
              <Input id="director_phone" placeholder="e.g. +1 617-555-5678" value={form.director_phone} disabled={isSubmitting} onChange={(e) => set('director_phone', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Accreditation</CardTitle><CardDescription>Accreditation body and status.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="accreditation_body">Accreditation Body</Label>
              <Input id="accreditation_body" placeholder="e.g. ABET, AACSB" value={form.accreditation_body} disabled={isSubmitting} onChange={(e) => set('accreditation_body', e.target.value)}/>
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
          <CardHeader><CardTitle>Campus Infrastructure</CardTitle><CardDescription>Physical and virtual campus details.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="campus_size">Campus Size (sq meters)</Label>
              <Input id="campus_size" type="number" min="0" placeholder="e.g. 500000" value={form.campus_size} disabled={isSubmitting} onChange={(e) => set('campus_size', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildings_count">Buildings Count</Label>
              <Input id="buildings_count" type="number" min="0" placeholder="e.g. 25" value={form.buildings_count} disabled={isSubmitting} onChange={(e) => set('buildings_count', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_capacity">Max Capacity</Label>
              <Input id="max_capacity" type="number" min="1" placeholder="e.g. 15000" value={form.max_capacity} disabled={isSubmitting} onChange={(e) => set('max_capacity', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parking_capacity">Parking Capacity</Label>
              <Input id="parking_capacity" type="number" min="0" placeholder="e.g. 2000" value={form.parking_capacity} disabled={isSubmitting} onChange={(e) => set('parking_capacity', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cafeteria_count">Cafeterias</Label>
              <Input id="cafeteria_count" type="number" min="0" placeholder="e.g. 5" value={form.cafeteria_count} disabled={isSubmitting} onChange={(e) => set('cafeteria_count', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="virtual_campus_url">Virtual Campus URL</Label>
              <Input id="virtual_campus_url" placeholder="https://virtual.university.edu" value={form.virtual_campus_url} disabled={isSubmitting} aria-invalid={Boolean(errors.virtual_campus_url)} onChange={(e) => set('virtual_campus_url', e.target.value)}/>
              <FieldError message={errors.virtual_campus_url}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Operations</CardTitle><CardDescription>Operating hours, emergency, and security.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="operating_hours">Operating Hours</Label>
              <Input id="operating_hours" placeholder="e.g. Mon-Fri 8:00-18:00" value={form.operating_hours} disabled={isSubmitting} onChange={(e) => set('operating_hours', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="library_hours">Library Hours</Label>
              <Input id="library_hours" placeholder="e.g. Mon-Sat 7:00-22:00" value={form.library_hours} disabled={isSubmitting} onChange={(e) => set('library_hours', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input id="emergency_contact" placeholder="e.g. Campus Security" value={form.emergency_contact} disabled={isSubmitting} onChange={(e) => set('emergency_contact', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_phone">Emergency Phone</Label>
              <Input id="emergency_phone" placeholder="e.g. +1 617-555-0911" value={form.emergency_phone} disabled={isSubmitting} onChange={(e) => set('emergency_phone', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medical_facilities">Medical Facilities</Label>
              <Input id="medical_facilities" placeholder="e.g. Health Center, Clinic" value={form.medical_facilities} disabled={isSubmitting} onChange={(e) => set('medical_facilities', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="security_details">Security Details</Label>
              <Input id="security_details" placeholder="e.g. 24/7 patrol, CCTV" value={form.security_details} disabled={isSubmitting} onChange={(e) => set('security_details', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notes & Settings</CardTitle><CardDescription>Additional campus configuration.</CardDescription></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="facilities">Facilities (JSON)</Label>
              <Textarea id="facilities" placeholder='e.g. {"labs": 30, "libraries": 3, "auditoriums": 5}' value={form.facilities} disabled={isSubmitting} onChange={(e) => set('facilities', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transport_routes">Transport Routes (JSON)</Label>
              <Textarea id="transport_routes" placeholder='e.g. [{"route": "A", "stops": ["Main Gate", "Library"]}]' value={form.transport_routes} disabled={isSubmitting} onChange={(e) => set('transport_routes', e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sports_facilities">Sports Facilities (JSON)</Label>
              <Textarea id="sports_facilities" placeholder='e.g. {"gym": true, "stadium": 1, "pool": true}' value={form.sports_facilities} disabled={isSubmitting} onChange={(e) => set('sports_facilities', e.target.value)}/>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button asChild type="button" variant="outline">
            <Link to="/campus">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Campus'}
          </Button>
        </div>
      </form>
    </div>);
}