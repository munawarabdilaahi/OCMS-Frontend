import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUniversities } from '@/services/universities.service';
import { createCampus } from '@/services/campus.service';
import { PageHeader } from '@/components/common/PageHeader';
import { campusSchema, emptyCampusValues } from './campus-schema.js';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';

const JSON_FIELDS = ['facilities', 'transport_routes', 'sports_facilities'];

function parseJsonField(value, field) {
    if (value === undefined || value === null) return null;
    if (typeof value !== 'string') return value;
    if (value.trim() === '') return null;
    try {
        return JSON.parse(value.trim());
    } catch {
        throw new Error(`${field} must contain valid JSON.`);
    }
}

export function AddCampus() {
    const navigate = useNavigate();
    const [universities, setUniversities] = useState([]);
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(campusSchema),
        defaultValues: emptyCampusValues,
    });

    useEffect(() => {
        getUniversities()
            .then((data) => { if (Array.isArray(data)) setUniversities(data); })
            .catch(() => toast.error('Failed to load form data.'));
    }, []);

    async function onSubmit(values) {
        try {
            const payload = { university_id: Number(values.university_id) };
            for (const [key, value] of Object.entries(values)) {
                if (key === 'university_id') continue;
                if (JSON_FIELDS.includes(key)) {
                    payload[key] = parseJsonField(value, key);
                } else if (value !== '' && value !== undefined) {
                    payload[key] = value;
                }
            }
            await createCampus(payload);
            toast.success('Campus created successfully.');
            navigate('/campus');
        } catch (err) {
            toast.error(err.message || 'Failed to create campus.');
        }
    }

    return (<div className="space-y-6">
      <PageHeader title="Add Campus" description="Create a new campus record with full enterprise details." />

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Campus identity and classification.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Campus Name *</Label>
              <Input id="name" placeholder="e.g. Main Campus" {...register('name')} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldErrorId('name') : undefined}/>
              <FieldError id={fieldErrorId('name')} message={errors.name?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g. MAIN (auto-generated if empty)" {...register('code')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="campus_type">Type</Label>
              <select id="campus_type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register('campus_type')} disabled={isSubmitting}>
                <option value="">Select Type</option>
                <option value="MAIN">Main</option>
                <option value="BRANCH">Branch</option>
                <option value="VIRTUAL">Virtual</option>
                <option value="SATELLITE">Satellite</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="established_date">Established Date</Label>
              <Input id="established_date" type="date" {...register('established_date')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>University *</Label>
              <Controller
                control={control}
                name="university_id"
                render={({ field }) => (
                  <Select value={field.value} disabled={isSubmitting} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={Boolean(errors.university_id)} aria-describedby={errors.university_id ? fieldErrorId('university_id') : undefined}><SelectValue placeholder="Select a university..."/></SelectTrigger>
                    <SelectContent>
                      {universities.map((u) => (<SelectItem key={u.id} value={String(u.id)}>{u.name} ({u.code})</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError id={fieldErrorId('university_id')} message={errors.university_id?.message}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle><CardDescription>Address, phone, email, and website.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="e.g. 456 College St, Boston, MA" {...register('address')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="e.g. +1 617-555-1234" {...register('phone')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="e.g. campus@university.edu" {...register('email')} disabled={isSubmitting} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? fieldErrorId('email') : undefined}/>
              <FieldError id={fieldErrorId('email')} message={errors.email?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="e.g. https://campus.university.edu" {...register('website')} disabled={isSubmitting} aria-invalid={Boolean(errors.website)} aria-describedby={errors.website ? fieldErrorId('website') : undefined}/>
              <FieldError id={fieldErrorId('website')} message={errors.website?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" placeholder="e.g. America/New_York" {...register('timezone')} disabled={isSubmitting}/>
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
          <CardHeader><CardTitle>Campus Director</CardTitle><CardDescription>Primary leadership contact.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="campus_director">Director Name</Label>
              <Input id="campus_director" placeholder="e.g. Dr. John Smith" {...register('campus_director')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="director_email">Director Email</Label>
              <Input id="director_email" type="email" placeholder="e.g. director@campus.edu" {...register('director_email')} disabled={isSubmitting} aria-invalid={Boolean(errors.director_email)} aria-describedby={errors.director_email ? fieldErrorId('director_email') : undefined}/>
              <FieldError id={fieldErrorId('director_email')} message={errors.director_email?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="director_phone">Director Phone</Label>
              <Input id="director_phone" placeholder="e.g. +1 617-555-5678" {...register('director_phone')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Accreditation</CardTitle><CardDescription>Accreditation body and status.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="accreditation_body">Accreditation Body</Label>
              <Input id="accreditation_body" placeholder="e.g. ABET, AACSB" {...register('accreditation_body')} disabled={isSubmitting}/>
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
          <CardHeader><CardTitle>Campus Infrastructure</CardTitle><CardDescription>Physical and virtual campus details.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="campus_size">Campus Size (sq meters)</Label>
              <Input id="campus_size" type="number" min="0" placeholder="e.g. 500000" {...register('campus_size')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildings_count">Buildings Count</Label>
              <Input id="buildings_count" type="number" min="0" placeholder="e.g. 25" {...register('buildings_count')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_capacity">Max Capacity</Label>
              <Input id="max_capacity" type="number" min="1" placeholder="e.g. 15000" {...register('max_capacity')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parking_capacity">Parking Capacity</Label>
              <Input id="parking_capacity" type="number" min="0" placeholder="e.g. 2000" {...register('parking_capacity')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cafeteria_count">Cafeterias</Label>
              <Input id="cafeteria_count" type="number" min="0" placeholder="e.g. 5" {...register('cafeteria_count')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="virtual_campus_url">Virtual Campus URL</Label>
              <Input id="virtual_campus_url" placeholder="https://virtual.university.edu" {...register('virtual_campus_url')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Operations</CardTitle><CardDescription>Operating hours, emergency, and security.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="operating_hours">Operating Hours</Label>
              <Input id="operating_hours" placeholder="e.g. Mon-Fri 8:00-18:00" {...register('operating_hours')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="library_hours">Library Hours</Label>
              <Input id="library_hours" placeholder="e.g. Mon-Sat 7:00-22:00" {...register('library_hours')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input id="emergency_contact" placeholder="e.g. Campus Security" {...register('emergency_contact')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_phone">Emergency Phone</Label>
              <Input id="emergency_phone" placeholder="e.g. +1 617-555-0911" {...register('emergency_phone')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medical_facilities">Medical Facilities</Label>
              <Input id="medical_facilities" placeholder="e.g. Health Center, Clinic" {...register('medical_facilities')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="security_details">Security Details</Label>
              <Input id="security_details" placeholder="e.g. 24/7 patrol, CCTV" {...register('security_details')} disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notes & Settings</CardTitle><CardDescription>Additional campus configuration.</CardDescription></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="facilities">Facilities (JSON)</Label>
              <Textarea id="facilities" placeholder='e.g. {"labs": 30, "libraries": 3, "auditoriums": 5}' {...register('facilities')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transport_routes">Transport Routes (JSON)</Label>
              <Textarea id="transport_routes" placeholder='e.g. [{"route": "A", "stops": ["Main Gate", "Library"]}]' {...register('transport_routes')} disabled={isSubmitting}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sports_facilities">Sports Facilities (JSON)</Label>
              <Textarea id="sports_facilities" placeholder='e.g. {"gym": true, "stadium": 1, "pool": true}' {...register('sports_facilities')} disabled={isSubmitting}/>
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