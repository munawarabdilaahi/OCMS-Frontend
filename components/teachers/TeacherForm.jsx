import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';
import { teacherDepartments, teacherPositions, teacherStatuses } from '@/features/teachers/teachers-data';
import { teacherSchema, emptyTeacherValues } from '@/features/teachers/teacher-schema';
import { getDepartments } from '@/services/departments.service';
import { createTeacher, updateTeacher } from '@/services/teachers.service';
import { GENDERS } from '@/lib/genders';

function SelectField({ control, name, label, options, disabled, error }) {
    const errorId = fieldErrorId(name);
    return (<div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller control={control} name={name} render={({ field }) => (<Select value={field.value} disabled={disabled} onValueChange={field.onChange}>
            <SelectTrigger id={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined}>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`}/>
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (<SelectItem key={option} value={option}>
                  {option}
                </SelectItem>))}
            </SelectContent>
          </Select>)}/>
      <FieldError id={errorId} message={error?.message}/>
    </div>);
}

export function TeacherForm({ mode = 'add', defaultValues }) {
    const navigate = useNavigate();
    const isEdit = mode === 'edit';
    const [departments, setDepartments] = useState(teacherDepartments);

    useEffect(() => {
        getDepartments()
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setDepartments(data.map((d) => d.name));
                }
            })
            .catch(() => {});
    }, []);

    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(teacherSchema),
        defaultValues: defaultValues || emptyTeacherValues,
    });

    async function onSubmit(values) {
        try {
            const deptData = await getDepartments();
            const dept = Array.isArray(deptData) ? deptData.find((d) => d.name === values.department) : null;

            const payload = {
                name: `${values.firstName} ${values.lastName}`.trim(),
                email: values.email,
                phone: values.phone,
                department_id: dept?.id || undefined,
                gender: values.gender,
                position: values.position,
                qualification: values.qualification,
                employment_date: values.employmentDate || undefined,
                address: values.address,
                status: values.status === 'Active' ? 'ACTIVE' : values.status.toUpperCase(),
            };

            if (isEdit) {
                await updateTeacher(Number(defaultValues?.id), payload);
                toast.success('Teacher record updated.');
                navigate('/teachers');
            } else {
                const created = await createTeacher(payload);
                toast.success('Teacher record created.');
                navigate('/teachers');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to save teacher record.');
        }
    }

    return (<Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Teacher' : 'Add Teacher'}</CardTitle>
        <CardDescription>
          {isEdit ? 'Update teacher employment and contact records.' : 'Create a new teacher record for OCMS.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" disabled={isSubmitting} aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? fieldErrorId('firstName') : undefined} {...register('firstName')}/>
              <FieldError id={fieldErrorId('firstName')} message={errors.firstName?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" disabled={isSubmitting} aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? fieldErrorId('lastName') : undefined} {...register('lastName')}/>
              <FieldError id={fieldErrorId('lastName')} message={errors.lastName?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" disabled={isSubmitting} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? fieldErrorId('email') : undefined} {...register('email')}/>
              <FieldError id={fieldErrorId('email')} message={errors.email?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" disabled={isSubmitting} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? fieldErrorId('phone') : undefined} {...register('phone')}/>
              <FieldError id={fieldErrorId('phone')} message={errors.phone?.message}/>
            </div>
            <SelectField control={control} name="gender" label="Gender" options={GENDERS} disabled={isSubmitting} error={errors.gender}/>
            <SelectField control={control} name="department" label="Department" options={departments} disabled={isSubmitting} error={errors.department}/>
            <SelectField control={control} name="position" label="Position" options={teacherPositions} disabled={isSubmitting} error={errors.position}/>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input id="qualification" disabled={isSubmitting} aria-invalid={Boolean(errors.qualification)} aria-describedby={errors.qualification ? fieldErrorId('qualification') : undefined} {...register('qualification')}/>
              <FieldError id={fieldErrorId('qualification')} message={errors.qualification?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentDate">Employment Date</Label>
              <Input id="employmentDate" type="date" disabled={isSubmitting} aria-invalid={Boolean(errors.employmentDate)} aria-describedby={errors.employmentDate ? fieldErrorId('employmentDate') : undefined} {...register('employmentDate')}/>
              <FieldError id={fieldErrorId('employmentDate')} message={errors.employmentDate?.message}/>
            </div>
            <SelectField control={control} name="status" label="Status" options={teacherStatuses} disabled={isSubmitting} error={errors.status}/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" disabled={isSubmitting} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? fieldErrorId('address') : undefined} {...register('address')}/>
            <FieldError id={fieldErrorId('address')} message={errors.address?.message}/>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button asChild type="button" variant="outline">
              <Link to="/teachers">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? 'Update Teacher' : 'Save Teacher'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>);
}
