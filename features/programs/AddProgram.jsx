import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDepartments } from '@/services/departments.service';
import { createProgram } from '@/services/programs.service';

const programTypes = ['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA', 'CERTIFICATE'];

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

export function AddProgram() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [durationYears, setDurationYears] = useState('');
    const [type, setType] = useState('');
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getDepartments()
            .then((data) => {
                if (Array.isArray(data)) setDepartments(data);
            })
            .catch(() => toast.error('Failed to load form data.'));
    }, []);

    function validate() {
        const errs = {};
        if (!name.trim()) errs.name = 'Program name is required.';
        if (!code.trim()) errs.code = 'Program code is required.';
        if (!departmentId) errs.departmentId = 'Department is required.';
        if (!type) errs.type = 'Program type is required.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await createProgram({
                name: name.trim(),
                code: code.trim(),
                department_id: Number(departmentId),
                duration_years: durationYears ? Number(durationYears) : undefined,
                type,
            });
            toast.success('Program created successfully.');
            navigate('/programs');
        }
        catch (err) {
            toast.error(err.message || 'Failed to create program.');
            setIsSubmitting(false);
        }
    }

    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Add Program</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new program record.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Program Details</CardTitle>
          <CardDescription>Enter the program name, code, department, and other details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name *</Label>
                <Input id="name" placeholder="e.g. Bachelor of Science" value={name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}/>
                <FieldError message={errors.name}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Program Code *</Label>
                <Input id="code" placeholder="e.g. BSC" value={code} disabled={isSubmitting} aria-invalid={Boolean(errors.code)} onChange={(e) => { setCode(e.target.value); setErrors((p) => ({ ...p, code: undefined })); }}/>
                <FieldError message={errors.code}/>
              </div>
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select value={departmentId} disabled={isSubmitting} onValueChange={(v) => { setDepartmentId(v); setErrors((p) => ({ ...p, departmentId: undefined })); }}>
                  <SelectTrigger aria-invalid={Boolean(errors.departmentId)}><SelectValue placeholder="Select a department..."/></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (<SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.departmentId}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationYears">Duration (Years)</Label>
                <Input id="durationYears" type="number" min="1" max="10" placeholder="e.g. 4" value={durationYears} disabled={isSubmitting} onChange={(e) => setDurationYears(e.target.value)}/>
              </div>
              <div className="space-y-2">
                <Label>Program Type *</Label>
                <Select value={type} disabled={isSubmitting} onValueChange={(v) => { setType(v); setErrors((p) => ({ ...p, type: undefined })); }}>
                  <SelectTrigger aria-invalid={Boolean(errors.type)}><SelectValue placeholder="Select program type..."/></SelectTrigger>
                  <SelectContent>
                    {programTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.type}/>
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
