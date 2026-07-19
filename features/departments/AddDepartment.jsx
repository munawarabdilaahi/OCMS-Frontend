import { useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createDepartment } from '@/services/departments.service';
function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}
export function AddDepartment() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    function validate() {
        const errs = {};
        if (!name.trim()) errs.name = 'Department name is required.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }
    async function handleSubmit(event) {
        event.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await createDepartment({ name: name.trim(), code: code.trim() || undefined });
            toast.success('Department created successfully.');
            navigate('/departments');
        }
        catch (err) {
            toast.error(err.message || 'Failed to create department.');
            setIsSubmitting(false);
        }
    }
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Add Department</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new academic department record.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
          <CardDescription>Enter the department name and optional code.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name *</Label>
                <Input id="name" placeholder="e.g. Computer Science" value={name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}/>
                <FieldError message={errors.name}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Department Code</Label>
                <Input id="code" placeholder="e.g. cs" value={code} disabled={isSubmitting} onChange={(e) => setCode(e.target.value)}/>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/departments">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Department'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
