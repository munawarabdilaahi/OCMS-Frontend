import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useParams, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';
import { editSemesterSchema, emptySemesterValues } from './semester-schema.js';
import { getAcademicYears } from '@/services/academic-years.service';
import { getSemester, updateSemester } from '@/services/semesters.service';
import { PageHeader } from '@/components/common/PageHeader';

export function EditSemester() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(editSemesterSchema),
        defaultValues: emptySemesterValues,
    });

    useEffect(() => {
        getAcademicYears()
            .then((data) => {
                if (Array.isArray(data)) setAcademicYears(data);
            })
            .catch(() => toast.error('Failed to load form data.'));
    }, []);

    useEffect(() => {
        if (!id) return;
        getSemester(id)
            .then((data) => {
                if (!data) { setError('Semester not found.'); return; }
                reset({
                    id: String(data.id || ''),
                    name: data.name || '',
                    academic_year_id: (data.academicYearId ?? data.academic_year_id)?.toString() || '',
                    start_date: data.startDate || data.start_date || '',
                    end_date: data.endDate || data.end_date || '',
                    status: data.status || 'ACTIVE',
                });
            })
            .catch(() => setError('Failed to load semester.'))
            .finally(() => setLoading(false));
    }, [id, reset]);

    async function onSubmit(values) {
        try {
            await updateSemester(id, {
                name: values.name.trim(),
                academic_year_id: Number(values.academic_year_id),
                start_date: values.start_date,
                end_date: values.end_date,
            });
            toast.success('Semester updated successfully.');
            navigate('/semesters');
        }
        catch (err) {
            toast.error(err.message || 'Failed to update semester.');
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading semester...</p></div>;
    }
    if (error) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Semester not found</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/semesters">Back to semesters</Link>
        </Button>
      </div>);
    }

    return (<div className="space-y-6">
      <PageHeader title="Edit Semester" description="Update the semester record." />

      <Card>
        <CardHeader>
          <CardTitle>Semester Details</CardTitle>
          <CardDescription>Update the semester name, academic year, and date range.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Semester Name *</Label>
                <Input id="name" placeholder="e.g. Semester 1" disabled={isSubmitting} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldErrorId('name') : undefined} {...register('name')}/>
                <FieldError id={fieldErrorId('name')} message={errors.name?.message}/>
              </div>
              <div className="space-y-2">
                <Label>Academic Year *</Label>
                <Controller control={control} name="academic_year_id" render={({ field }) => (
                  <Select value={field.value} disabled={isSubmitting} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={Boolean(errors.academic_year_id)} aria-describedby={errors.academic_year_id ? fieldErrorId('academic_year_id') : undefined}>
                      <SelectValue placeholder="Select academic year..."/>
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((a) => (<SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}/>
                <FieldError id={fieldErrorId('academic_year_id')} message={errors.academic_year_id?.message}/>
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
                <Link to="/semesters">Cancel</Link>
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
