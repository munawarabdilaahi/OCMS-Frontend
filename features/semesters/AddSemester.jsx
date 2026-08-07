import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAcademicYears } from '@/services/academic-years.service';
import { createSemester } from '@/services/semesters.service';
import { PageHeader } from '@/components/common/PageHeader';

function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

export function AddSemester() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [academicYearId, setAcademicYearId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [academicYears, setAcademicYears] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getAcademicYears()
            .then((data) => {
                if (Array.isArray(data)) setAcademicYears(data);
            })
            .catch(() => toast.error('Failed to load form data.'));
    }, []);

    function validate() {
        const errs = {};
        if (!name.trim()) errs.name = 'Semester name is required.';
        if (!academicYearId) errs.academicYearId = 'Academic year is required.';
        if (!startDate) errs.startDate = 'Start date is required.';
        if (!endDate) errs.endDate = 'End date is required.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await createSemester({
                name: name.trim(),
                academic_year_id: Number(academicYearId),
                start_date: startDate,
                end_date: endDate,
            });
            toast.success('Semester created successfully.');
            navigate('/semesters');
        }
        catch (err) {
            toast.error(err.message || 'Failed to create semester.');
            setIsSubmitting(false);
        }
    }

    return (<div className="space-y-6">
      <PageHeader title="Add Semester" description="Create a new semester record." />

      <Card>
        <CardHeader>
          <CardTitle>Semester Details</CardTitle>
          <CardDescription>Enter the semester name, academic year, and date range.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Semester Name *</Label>
                <Input id="name" placeholder="e.g. Semester 1" value={name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}/>
                <FieldError message={errors.name}/>
              </div>
              <div className="space-y-2">
                <Label>Academic Year *</Label>
                <Select value={academicYearId} disabled={isSubmitting} onValueChange={(v) => { setAcademicYearId(v); setErrors((p) => ({ ...p, academicYearId: undefined })); }}>
                  <SelectTrigger aria-invalid={Boolean(errors.academicYearId)}><SelectValue placeholder="Select academic year..."/></SelectTrigger>
                  <SelectContent>
                    {academicYears.map((a) => (<SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.academicYearId}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input id="startDate" type="date" value={startDate} disabled={isSubmitting} aria-invalid={Boolean(errors.startDate)} onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: undefined })); }}/>
                <FieldError message={errors.startDate}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input id="endDate" type="date" value={endDate} disabled={isSubmitting} aria-invalid={Boolean(errors.endDate)} onChange={(e) => { setEndDate(e.target.value); setErrors((p) => ({ ...p, endDate: undefined })); }}/>
                <FieldError message={errors.endDate}/>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/semesters">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Semester'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
