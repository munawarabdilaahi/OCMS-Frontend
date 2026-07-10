import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { departmentStatuses, getDepartmentByCode, headOfDepartmentOptions, saveDepartment } from '@/features/departments/DepartmentsList';
const emptyDepartment = {
    code: '',
    name: '',
    description: '',
    headOfDepartment: '',
    status: 'Active',
};
function FieldError({ message }) {
    if (!message) {
        return null;
    }
    return <p className="text-sm text-destructive">{message}</p>;
}
function validateDepartment(values) {
    const errors = {};
    if (!values.code.trim()) {
        errors.code = 'Department code is required.';
    }
    else if (!/^[A-Z0-9-]{2,12}$/i.test(values.code.trim())) {
        errors.code = 'Use 2 to 12 letters, numbers, or hyphens.';
    }
    else if (getDepartmentByCode(values.code.trim().toUpperCase())) {
        errors.code = 'A department with this code already exists.';
    }
    if (!values.name.trim()) {
        errors.name = 'Department name is required.';
    }
    if (!values.description.trim()) {
        errors.description = 'Description is required.';
    }
    if (!values.headOfDepartment) {
        errors.headOfDepartment = 'Head of Department is required.';
    }
    if (!values.status) {
        errors.status = 'Status is required.';
    }
    return errors;
}
export function AddDepartment() {
    const navigate = useNavigate();
    const [values, setValues] = useState(emptyDepartment);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    function updateField(name, value) {
        setValues((currentValues) => ({ ...currentValues, [name]: value }));
        setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const normalizedValues = {
            ...values,
            code: values.code.trim().toUpperCase(),
            name: values.name.trim(),
            description: values.description.trim(),
        };
        const validationErrors = validateDepartment(normalizedValues);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }
        setIsSubmitting(true);
        await new Promise((resolve) => window.setTimeout(resolve, 500));
        saveDepartment(normalizedValues);
        setSaved(true);
        navigate('/departments');
    }
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Add Department</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new academic department record.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
          <CardDescription>Enter the official department identity, leadership, and status.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {saved && (<Alert variant="success">
                <AlertTitle>Department saved</AlertTitle>
                <AlertDescription>This mock form is ready for backend integration.</AlertDescription>
              </Alert>)}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Department Code</Label>
                <Input id="code" placeholder="CS" value={values.code} disabled={isSubmitting} aria-invalid={Boolean(errors.code)} onChange={(event) => updateField('code', event.target.value)}/>
                <FieldError message={errors.code}/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input id="name" placeholder="Computer Science" value={values.name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(event) => updateField('name', event.target.value)}/>
                <FieldError message={errors.name}/>
              </div>

              <div className="space-y-2">
                <Label>Head of Department</Label>
                <Select value={values.headOfDepartment} disabled={isSubmitting} onValueChange={(value) => updateField('headOfDepartment', value)}>
                  <SelectTrigger aria-invalid={Boolean(errors.headOfDepartment)}>
                    <SelectValue placeholder="Select head of department"/>
                  </SelectTrigger>
                  <SelectContent>
                    {headOfDepartmentOptions.map((headOfDepartment) => (<SelectItem key={headOfDepartment} value={headOfDepartment}>
                        {headOfDepartment}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.headOfDepartment}/>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={values.status} disabled={isSubmitting} onValueChange={(value) => updateField('status', value)}>
                  <SelectTrigger aria-invalid={Boolean(errors.status)}>
                    <SelectValue placeholder="Select status"/>
                  </SelectTrigger>
                  <SelectContent>
                    {departmentStatuses.map((status) => (<SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.status}/>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Summarize the department focus and academic scope." value={values.description} disabled={isSubmitting} aria-invalid={Boolean(errors.description)} onChange={(event) => updateField('description', event.target.value)}/>
              <FieldError message={errors.description}/>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/departments">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin"/> : <Save />}
                {isSubmitting ? 'Saving' : 'Save Department'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
