import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPrograms } from '@/services/programs.service';
import { getLevel, updateLevel } from '@/services/levels.service';
import { PageHeader } from '@/components/common/PageHeader';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

export function EditLevel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [programId, setProgramId] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [programs, setPrograms] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getPrograms()
            .then((data) => {
                if (Array.isArray(data)) setPrograms(data);
            })
            .catch(() => toast.error('Failed to load form data.'));
    }, []);

    useEffect(() => {
        if (!id) return;
        getLevel(id)
            .then((data) => {
                if (!data) { setError('Level not found.'); return; }
                setName(data.name || '');
                setCode(data.code || '');
                setProgramId((data.programId ?? data.program_id)?.toString() || '');
                setSortOrder((data.sortOrder ?? data.sort_order)?.toString() || '');
            })
            .catch(() => setError('Failed to load level.'))
            .finally(() => setLoading(false));
    }, [id]);

    function validate() {
        const errs = {};
        if (!name.trim()) errs.name = 'Level name is required.';
        if (!code.trim()) errs.code = 'Level code is required.';
        if (!programId) errs.programId = 'Program is required.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await updateLevel(id, {
                name: name.trim(),
                code: code.trim(),
                program_id: Number(programId),
                sort_order: sortOrder ? Number(sortOrder) : undefined,
            });
            toast.success('Level updated successfully.');
            navigate('/levels');
        }
        catch (err) {
            toast.error(err.message || 'Failed to update level.');
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading level...</p></div>;
    }
    if (error) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Level not found</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/levels">Back to levels</Link>
        </Button>
      </div>);
    }

    return (<div className="space-y-6">
      <PageHeader title="Edit Level" description="Update the level record." />

      <Card>
        <CardHeader>
          <CardTitle>Level Details</CardTitle>
          <CardDescription>Update the level name, code, and associated program.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Level Name *</Label>
                <Input id="name" placeholder="e.g. Year 1" value={name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}/>
                <FieldError message={errors.name}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Level Code *</Label>
                <Input id="code" placeholder="e.g. Y1" value={code} disabled={isSubmitting} aria-invalid={Boolean(errors.code)} onChange={(e) => { setCode(e.target.value); setErrors((p) => ({ ...p, code: undefined })); }}/>
                <FieldError message={errors.code}/>
              </div>
              <div className="space-y-2">
                <Label>Program *</Label>
                <Select value={programId} disabled={isSubmitting} onValueChange={(v) => { setProgramId(v); setErrors((p) => ({ ...p, programId: undefined })); }}>
                  <SelectTrigger aria-invalid={Boolean(errors.programId)}><SelectValue placeholder="Select a program..."/></SelectTrigger>
                  <SelectContent>
                    {programs.map((p) => (<SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.programId}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input id="sortOrder" type="number" min="1" placeholder="e.g. 1" value={sortOrder} disabled={isSubmitting} onChange={(e) => setSortOrder(e.target.value)}/>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/levels">Cancel</Link>
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
