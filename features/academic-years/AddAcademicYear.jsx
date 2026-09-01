import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';
import { academicYearSchema, emptyAcademicYearValues } from './academic-year-schema.js';
import { createAcademicYear } from '@/services/academic-years.service';
import { PageHeader } from '@/components/common/PageHeader';

export function AddAcademicYear() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(academicYearSchema),
        defaultValues: emptyAcademicYearValues,
    });

    async function onSubmit(values) {
        try {
            await createAcademicYear({
                name: values.name.trim(),
                start_date: values.start_date,
                end_date: values.end_date,
            });
            toast.success('Academic year created successfully.');
            navigate('/academic-years');
        }
        catch (err) {
            toast.error(err.message || 'Failed to create academic year.');
        }
    }

    return (<div className="space-y-6">
      <PageHeader title="Add Academic Year" description="Create a new academic year record." />

      <Card>
        <CardHeader>
          <CardTitle>Academic Year Details</CardTitle>
          <CardDescription>Enter the academic year name and date range.</CardDescription>
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
                {isSubmitting ? 'Saving...' : 'Save Academic Year'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
