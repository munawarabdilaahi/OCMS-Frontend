import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';
import { programSchema, emptyProgramValues } from './program-schema.js';
import { getDepartments } from '@/services/departments.service';
import { createProgram } from '@/services/programs.service';
import { PageHeader } from '@/components/common/PageHeader';

const programTypes = ['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA', 'CERTIFICATE'];

export function AddProgram() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(programSchema),
        defaultValues: emptyProgramValues,
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
            await createProgram({
                name: values.name.trim(),
                code: values.code.trim(),
                department_id: Number(values.department_id),
                duration_years: values.duration_years ? Number(values.duration_years) : undefined,
                type: values.type,
            });
            toast.success('Program created successfully.');
            navigate('/programs');
        }
        catch (err) {
            toast.error(err.message || 'Failed to create program.');
        }
    }

    return (<div className="space-y-6">
      <PageHeader title="Add Program" description="Create a new program record." />

      <Card>
        <CardHeader>
          <CardTitle>Program Details</CardTitle>
          <CardDescription>Enter the program name, code, department, and other details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name *</Label>
                <Input id="name" placeholder="e.g. Bachelor of Science" disabled={isSubmitting} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldErrorId('name') : undefined} {...register('name')}/>
                <FieldError id={fieldErrorId('name')} message={errors.name?.message}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Program Code *</Label>
                <Input id="code" placeholder="e.g. BSC" disabled={isSubmitting} aria-invalid={Boolean(errors.code)} aria-describedby={errors.code ? fieldErrorId('code') : undefined} {...register('code')}/>
                <FieldError id={fieldErrorId('code')} message={errors.code?.message}/>
              </div>
              <div className="space-y-2">
                <Label>Department *</Label>
                <Controller control={control} name="department_id" render={({ field }) => (
                  <Select value={field.value} disabled={isSubmitting} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={Boolean(errors.department_id)} aria-describedby={errors.department_id ? fieldErrorId('department_id') : undefined}>
                      <SelectValue placeholder="Select a department..."/>
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (<SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}/>
                <FieldError id={fieldErrorId('department_id')} message={errors.department_id?.message}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_years">Duration (Years)</Label>
                <Input id="duration_years" type="number" min="1" max="10" placeholder="e.g. 4" disabled={isSubmitting} {...register('duration_years')}/>
              </div>
              <div className="space-y-2">
                <Label>Program Type *</Label>
                <Controller control={control} name="type" render={({ field }) => (
                  <Select value={field.value} disabled={isSubmitting} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={Boolean(errors.type)} aria-describedby={errors.type ? fieldErrorId('type') : undefined}>
                      <SelectValue placeholder="Select program type..."/>
                    </SelectTrigger>
                    <SelectContent>
                      {programTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}/>
                <FieldError id={fieldErrorId('type')} message={errors.type?.message}/>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/programs">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Program'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
