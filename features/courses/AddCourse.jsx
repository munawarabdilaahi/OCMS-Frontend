import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';
import { courseSemesters, courseStatuses } from '@/features/courses/course-constants';
import { courseSchema, emptyCourseValues } from './course-schema.js';
import { getDepartments } from '@/services/departments.service';
import { createCourse } from '@/services/courses.service';
import { PageHeader } from '@/components/common/PageHeader';
import { UnauthorizedPage } from '@/features/UnauthorizedPage';
import { useAuth } from '@/hooks/useAuth';

export function AddCourse() {
    const navigate = useNavigate();
    const { can } = useAuth();
    const [departments, setDepartments] = useState([]);
    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(courseSchema),
        defaultValues: { ...emptyCourseValues, semester: courseSemesters[0] },
    });

    useEffect(() => {
        getDepartments()
            .then((data) => {
                if (Array.isArray(data)) setDepartments(data);
            })
            .catch(() => toast.error('Failed to load form data.'));
    }, []);

    async function onSubmit(values) {
        try {
            await createCourse({
                code: values.code?.trim() || undefined,
                title: values.title.trim(),
                credit_hours: values.credit_hours ? Number(values.credit_hours) : undefined,
                semester: values.semester,
                status: values.status,
                department_id: values.department_id ? Number(values.department_id) : undefined,
            });
            toast.success('Course created successfully.');
            navigate('/courses');
        } catch (err) {
            toast.error(err.message || 'Failed to create course.');
        }
    }

    if (!can('courses:manage')) {
        return <UnauthorizedPage />;
    }

    return (<div className="space-y-6">
      <PageHeader title="Add Course" description="Create a new course catalog record." />

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Enter the course code, title, department, and academic details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input id="code" placeholder="e.g. CS101" disabled={isSubmitting} {...register('code')}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input id="title" placeholder="e.g. Introduction to Programming" disabled={isSubmitting} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? fieldErrorId('title') : undefined} {...register('title')}/>
                <FieldError id={fieldErrorId('title')} message={errors.title?.message}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditHours">Credit Hours</Label>
                <Input id="creditHours" type="number" min="1" max="10" disabled={isSubmitting} {...register('credit_hours')}/>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Controller control={control} name="department_id" render={({ field }) => (
                  <Select value={field.value} disabled={isSubmitting} onValueChange={field.onChange}>
                    <SelectTrigger id="department_id" aria-invalid={Boolean(errors.department_id)} aria-describedby={errors.department_id ? fieldErrorId('department_id') : undefined}>
                      <SelectValue placeholder="Select department"/>
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (<SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}/>
                <FieldError id={fieldErrorId('department_id')} message={errors.department_id?.message}/>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Controller control={control} name="semester" render={({ field }) => (
                  <Select value={field.value} disabled={isSubmitting} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={Boolean(errors.semester)} aria-describedby={errors.semester ? fieldErrorId('semester') : undefined}>
                      <SelectValue placeholder="Select semester"/>
                    </SelectTrigger>
                    <SelectContent>
                      {courseSemesters.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}/>
                <FieldError id={fieldErrorId('semester')} message={errors.semester?.message}/>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller control={control} name="status" render={({ field }) => (
                  <Select value={field.value} disabled={isSubmitting} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={Boolean(errors.status)} aria-describedby={errors.status ? fieldErrorId('status') : undefined}>
                      <SelectValue placeholder="Select status"/>
                    </SelectTrigger>
                    <SelectContent>
                      {courseStatuses.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}/>
                <FieldError id={fieldErrorId('status')} message={errors.status?.message}/>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/courses">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Course'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
