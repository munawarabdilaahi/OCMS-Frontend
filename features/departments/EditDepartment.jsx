import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getDepartment, updateDepartment } from '@/services/departments.service';
function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}
export function EditDepartment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!id) return;
        getDepartment(id)
            .then((data) => {
            if (!data) { setError('Department not found.'); return; }
            setName(data.name || '');
            setCode(data.code || '');
        })
            .catch(() => setError('Failed to load department.'))
            .finally(() => setLoading(false));
    }, [id]);
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
            await updateDepartment(id, { name: name.trim(), code: code.trim() || undefined });
            toast.success('Department updated successfully.');
            navigate('/departments');
        }
        catch (err) {
            toast.error(err.message || 'Failed to update department.');
            setIsSubmitting(false);
        }
    }
    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading department...</p></div>;
    }
    if (error) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Department not found</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/departments">Back to departments</Link>
        </Button>
      </div>);
    }
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Edit Department</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update the department record.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
          <CardDescription>Update the department name and code.</CardDescription>
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
