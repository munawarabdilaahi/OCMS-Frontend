import { useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAcademicYear } from '@/services/academic-years.service';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

export function AddAcademicYear() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    function validate() {
        const errs = {};
        if (!name.trim()) errs.name = 'Academic year name is required.';
        if (!startDate) errs.startDate = 'Start date is required.';
        if (!endDate) errs.endDate = 'End date is required.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await createAcademicYear({
                name: name.trim(),
                start_date: startDate,
                end_date: endDate,
            });
            toast.success('Academic year created successfully.');
            navigate('/academic-years');
        }
        catch (err) {
            toast.error(err.message || 'Failed to create academic year.');
            setIsSubmitting(false);
        }
    }

    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Add Academic Year</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new academic year record.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Year Details</CardTitle>
          <CardDescription>Enter the academic year name and date range.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Academic Year Name *</Label>
                <Input id="name" placeholder="e.g. 2024/2025" value={name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}/>
                <FieldError message={errors.name}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input id="startDate" type="date" value={startDate} disabled={isSubmitting} aria-invalid={Boolean(errors.startDate)} onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: undefined })); }}/>
                <FieldError message={errors.startDate}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input id="endDate" type="date" value={endDate} disabled={isSubmitting} aria-invalid={Boolean(errors.endDate)} onChange={(e) => { setEndDate(e.target.value); setErrors((p) => ({ ...p, endDate: undefined })); }}/>
                <FieldError message={errors.endDate}/>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/academic-years">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Academic Year'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
