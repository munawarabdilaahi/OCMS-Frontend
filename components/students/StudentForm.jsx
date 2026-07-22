import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
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
import { genders, studentStatuses } from '@/features/students/students-data';
import { addStudentSchema, editStudentSchema, emptyStudentValues } from '@/features/students/student-schema';
import { getDepartments } from '@/services/departments.service';
import { createStudent, updateStudent } from '@/services/students.service';
function FieldError({ message }) {
    if (!message) {
        return null;
    }
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
export function StudentForm({ mode = 'add', defaultValues = emptyStudentValues }) {
    const navigate = useNavigate();
    const isEdit = mode === 'edit';
    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        getDepartments().then((data) => {
            if (Array.isArray(data)) setDepartments(data);
        }).catch(() => {});
    }, []);
    const { control, register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, } = useForm({
        resolver: zodResolver(isEdit ? editStudentSchema : addStudentSchema),
        defaultValues,
    });
    async function onSubmit(values) {
        try {
            const payload = {
                name: `${values.firstName} ${values.lastName}`.trim(),
                email: values.email,
                phone: values.phone,
                department_id: Number(values.department_id),
                date_of_birth: values.dateOfBirth || undefined,
                gender: values.gender,
                address: values.address,
                status: values.status.toUpperCase(),
            };
            if (mode === 'edit') {
                await updateStudent(Number(values.id), payload);
                toast.success('Student record updated.');
                navigate(`/students/${values.id}`);
            }
            else {
                const created = await createStudent({ ...payload, password: 'campus123' });
                toast.success('Student record created.');
                navigate(`/students/${created?.id}`);
            }
        }
        catch (error) {
            toast.error(error.message || 'Failed to save student record.');
        }
    }
    return (<Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Student' : 'Add Student'}</CardTitle>
        <CardDescription>
          {isEdit ? 'Update student enrollment and contact records.' : 'Create a new student record for OCMS.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {isSubmitSuccessful && (<Alert variant="success">
              <AlertTitle>Student record saved</AlertTitle>
              <AlertDescription>The student record has been saved to the database.</AlertDescription>
            </Alert>)}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="id">Student ID</Label>
              <Input id="id" disabled aria-invalid={Boolean(errors.id)} {...register('id')}/>
              <FieldError message={errors.id?.message}/>
            </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" disabled={isSubmitting} aria-invalid={Boolean(errors.firstName)} {...register('firstName')}/>
              <FieldError message={errors.firstName?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" disabled={isSubmitting} aria-invalid={Boolean(errors.lastName)} {...register('lastName')}/>
              <FieldError message={errors.lastName?.message}/>
            </div>
            <SelectField control={control} name="gender" label="Gender" options={genders} disabled={isSubmitting} error={errors.gender}/>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" disabled={isSubmitting} aria-invalid={Boolean(errors.dateOfBirth)} {...register('dateOfBirth')}/>
              <FieldError message={errors.dateOfBirth?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" disabled={isSubmitting} aria-invalid={Boolean(errors.email)} {...register('email')}/>
              <FieldError message={errors.email?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" disabled={isSubmitting} aria-invalid={Boolean(errors.phone)} {...register('phone')}/>
              <FieldError message={errors.phone?.message}/>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Controller control={control} name="department_id" render={({ field }) => (<Select value={field.value} disabled={isSubmitting} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={Boolean(errors.department_id)}>
                      <SelectValue placeholder="Select department"/>
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (<SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>))}
                    </SelectContent>
                  </Select>)}/>
              <FieldError message={errors.department_id?.message}/>
            </div>
            <SelectField control={control} name="status" label="Status" options={studentStatuses} disabled={isSubmitting} error={errors.status}/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" disabled={isSubmitting} aria-invalid={Boolean(errors.address)} {...register('address')}/>
            <FieldError message={errors.address?.message}/>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button asChild type="button" variant="outline">
              <Link to="/students">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin"/> : <Save />}
              {isSubmitting ? 'Saving' : 'Save Student'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>);
}
