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
import { levelSchema, emptyLevelValues } from './level-schema.js';
import { getPrograms } from '@/services/programs.service';
import { createLevel } from '@/services/levels.service';
import { PageHeader } from '@/components/common/PageHeader';

export function AddLevel() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(levelSchema),
        defaultValues: emptyLevelValues,
    });

    useEffect(() => {
        getPrograms()
            .then((data) => {
                if (Array.isArray(data)) setPrograms(data);
            })
            .catch(() => toast.error('Failed to load form data.'));
    }, []);

    async function onSubmit(values) {
        try {
            await createLevel({
                name: values.name.trim(),
                code: values.code.trim(),
                program_id: Number(values.program_id),
                sort_order: values.sort_order ? Number(values.sort_order) : undefined,
            });
            toast.success('Level created successfully.');
            navigate('/levels');
        }
        catch (err) {
            toast.error(err.message || 'Failed to create level.');
        }
    }

    return (<div className="space-y-6">
      <PageHeader title="Add Level" description="Create a new level record." />

      <Card>
        <CardHeader>
          <CardTitle>Level Details</CardTitle>
          <CardDescription>Enter the level name, code, and associated program.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Level Name *</Label>
                <Input id="name" placeholder="e.g. Year 1" disabled={isSubmitting} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldErrorId('name') : undefined} {...register('name')}/>
                <FieldError id={fieldErrorId('name')} message={errors.name?.message}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Level Code *</Label>
                <Input id="code" placeholder="e.g. Y1" disabled={isSubmitting} aria-invalid={Boolean(errors.code)} aria-describedby={errors.code ? fieldErrorId('code') : undefined} {...register('code')}/>
                <FieldError id={fieldErrorId('code')} message={errors.code?.message}/>
              </div>
              <div className="space-y-2">
                <Label>Program *</Label>
                <Controller control={control} name="program_id" render={({ field }) => (
                  <Select value={field.value} disabled={isSubmitting} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={Boolean(errors.program_id)} aria-describedby={errors.program_id ? fieldErrorId('program_id') : undefined}>
                      <SelectValue placeholder="Select a program..."/>
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((p) => (<SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                )}/>
                <FieldError id={fieldErrorId('program_id')} message={errors.program_id?.message}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input id="sort_order" type="number" min="1" placeholder="e.g. 1" disabled={isSubmitting} {...register('sort_order')}/>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/levels">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Level'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
