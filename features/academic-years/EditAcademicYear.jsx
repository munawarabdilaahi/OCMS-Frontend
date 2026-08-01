import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAcademicYear, updateAcademicYear } from '@/services/academic-years.service';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

export function EditAcademicYear() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        getAcademicYear(id)
            .then((data) => {
                if (!data) { setError('Academic year not found.'); return; }
                setName(data.name || '');
                setStartDate(data.startDate || data.start_date || '');
                setEndDate(data.endDate || data.end_date || '');
            })
            .catch(() => setError('Failed to load academic year.'))
            .finally(() => setLoading(false));
    }, [id]);

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
            await updateAcademicYear(id, {
                name: name.trim(),
                start_date: startDate,
                end_date: endDate,
            });
            toast.success('Academic year updated successfully.');
            navigate('/academic-years');
        }
        catch (err) {
            toast.error(err.message || 'Failed to update academic year.');
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading academic year...</p></div>;
    }
    if (error) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Academic year not found</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/academic-years">Back to academic years</Link>
        </Button>
      </div>);
    }

    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Edit Academic Year</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update the academic year record.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Year Details</CardTitle>
          <CardDescription>Update the academic year name and date range.</CardDescription>
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
