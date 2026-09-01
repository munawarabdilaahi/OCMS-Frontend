import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useParams, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';
import { editAcademicYearSchema, emptyAcademicYearValues } from './academic-year-schema.js';
import { getAcademicYear, updateAcademicYear } from '@/services/academic-years.service';
import { PageHeader } from '@/components/common/PageHeader';

export function EditAcademicYear() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(editAcademicYearSchema),
        defaultValues: emptyAcademicYearValues,
    });

    useEffect(() => {
        if (!id) return;
        getAcademicYear(id)
            .then((data) => {
                if (!data) { setError('Academic year not found.'); return; }
                reset({
                    id: String(data.id || ''),
                    name: data.name || '',
                    start_date: data.startDate || data.start_date || '',
                    end_date: data.endDate || data.end_date || '',
                    status: data.status || 'ACTIVE',
                });
            })
            .catch(() => setError('Failed to load academic year.'))
            .finally(() => setLoading(false));
    }, [id, reset]);

    async function onSubmit(values) {
        try {
            await updateAcademicYear(id, {
                name: values.name.trim(),
                start_date: values.start_date,
                end_date: values.end_date,
            });
            toast.success('Academic year updated successfully.');
            navigate('/academic-years');
        }
        catch (err) {
            toast.error(err.message || 'Failed to update academic year.');
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
      <PageHeader title="Edit Academic Year" description="Update the academic year record." />

      <Card>
        <CardHeader>
          <CardTitle>Academic Year Details</CardTitle>
          <CardDescription>Update the academic year name and date range.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Academic Year Name *</Label>
                <Input id="name" placeholder="e.g. 2024/2025" disabled={isSubmitting} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldErrorId('name') : undefined} {...register('name')}/>
                <FieldError id={fieldErrorId('name')} message={errors.name?.message}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input id="start_date" type="date" disabled={isSubmitting} aria-invalid={Boolean(errors.start_date)} aria-describedby={errors.start_date ? fieldErrorId('start_date') : undefined} {...register('start_date')}/>
                <FieldError id={fieldErrorId('start_date')} message={errors.start_date?.message}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input id="end_date" type="date" disabled={isSubmitting} aria-invalid={Boolean(errors.end_date)} aria-describedby={errors.end_date ? fieldErrorId('end_date') : undefined} {...register('end_date')}/>
                <FieldError id={fieldErrorId('end_date')} message={errors.end_date?.message}/>
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
