import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { teacherDepartments, teacherPositions, teacherStatuses } from '@/features/teachers/teachers-data';
import { getDepartments } from '@/services/departments.service';
import { createTeacher, updateTeacher } from '@/services/teachers.service';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

function SelectField({ control, name, label, options, disabled, error }) {
    return (<div className="space-y-2">
      <Label>{label}</Label>
      <Controller control={control} name={name} render={({ field }) => (<Select value={field.value} disabled={disabled} onValueChange={field.onChange}>
            <SelectTrigger aria-invalid={Boolean(error)}>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`}/>
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (<SelectItem key={option} value={option}>
                  {option}
                </SelectItem>))}
            </SelectContent>
          </Select>)}/>
      <FieldError message={error?.message}/>
    </div>);
}

export function TeacherForm({ mode = 'add', defaultValues }) {
    const navigate = useNavigate();
    const isEdit = mode === 'edit';
    const [departments, setDepartments] = useState(teacherDepartments);

    useEffect(() => {
        getDepartments()
            .then((response) => {
                const data = response?.data ?? [];
                if (Array.isArray(data) && data.length > 0) {
                    setDepartments(data.map((d) => d.name));
                }
            })
            .catch(() => {});
    }, []);

    const emptyValues = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: 'Male',
        department: departments[0] || 'Computer Science',
        position: 'Lecturer',
        qualification: '',
        employmentDate: '',
        address: '',
        status: 'Active',
        ...(defaultValues || {}),
    };

    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: emptyValues });

    async function onSubmit(values) {
        try {
            const deptResponse = await getDepartments();
            const deptData = deptResponse?.data ?? [];
            const dept = Array.isArray(deptData) ? deptData.find((d) => d.name === values.department) : null;

            const payload = {
                name: `${values.firstName} ${values.lastName}`.trim(),
                email: values.email,
                password: isEdit ? undefined : 'Campus123',
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
              <Input id="firstName" disabled={isSubmitting} aria-invalid={Boolean(errors.firstName)} {...register('firstName', { required: 'First name is required.' })}/>
              <FieldError message={errors.firstName?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" disabled={isSubmitting} aria-invalid={Boolean(errors.lastName)} {...register('lastName', { required: 'Last name is required.' })}/>
              <FieldError message={errors.lastName?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" disabled={isSubmitting} aria-invalid={Boolean(errors.email)} {...register('email', { required: 'Email is required.' })}/>
              <FieldError message={errors.email?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" disabled={isSubmitting} aria-invalid={Boolean(errors.phone)} {...register('phone', { required: 'Phone is required.' })}/>
              <FieldError message={errors.phone?.message}/>
            </div>
            <SelectField control={control} name="gender" label="Gender" options={['Male', 'Female', 'Other']} disabled={isSubmitting} error={errors.gender}/>
            <SelectField control={control} name="department" label="Department" options={departments} disabled={isSubmitting} error={errors.department}/>
            <SelectField control={control} name="position" label="Position" options={teacherPositions} disabled={isSubmitting} error={errors.position}/>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input id="qualification" disabled={isSubmitting} aria-invalid={Boolean(errors.qualification)} {...register('qualification', { required: 'Qualification is required.' })}/>
              <FieldError message={errors.qualification?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentDate">Employment Date</Label>
              <Input id="employmentDate" type="date" disabled={isSubmitting} aria-invalid={Boolean(errors.employmentDate)} {...register('employmentDate')}/>
              <FieldError message={errors.employmentDate?.message}/>
            </div>
            <SelectField control={control} name="status" label="Status" options={teacherStatuses} disabled={isSubmitting} error={errors.status}/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" disabled={isSubmitting} aria-invalid={Boolean(errors.address)} {...register('address')}/>
            <FieldError message={errors.address?.message}/>
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
