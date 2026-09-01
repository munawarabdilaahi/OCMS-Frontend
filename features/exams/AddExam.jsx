import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';
import { examStatuses } from '@/features/exams/ExamsList';
import { examSchema, emptyExamValues } from './exam-schema.js';
import { createExamSchedule } from '@/services/exams.service';
import { PageHeader } from '@/components/common/PageHeader';

export function AddExam() {
    const navigate = useNavigate();
    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(examSchema),
        defaultValues: emptyExamValues,
    });

    async function onSubmit(values) {
        try {
            await createExamSchedule({
                title: values.name.trim(),
                course_id: Number(values.course),
                exam_date: values.date,
                status: values.status?.toUpperCase() || 'SCHEDULED',
            });
            toast.success('Exam schedule created.');
            navigate('/exams');
        }
        catch (error) {
            toast.error(error.message || 'Failed to create exam schedule.');
        }
    }
    return (<div className="space-y-6">
      <PageHeader title="Add Exam" description="Schedule a new course exam or assessment." />

      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
          <CardDescription>Enter exam identity, course, date, marks, and current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Exam Title</Label>
                <Input id="title" placeholder="Programming Midterm" disabled={isSubmitting} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldErrorId('name') : undefined} {...register('name')}/>
                <FieldError id={fieldErrorId('name')} message={errors.name?.message}/>
              </div>

              <div className="space-y-2">
                <Label>Course ID</Label>
                <Input placeholder="Course ID" disabled={isSubmitting} aria-invalid={Boolean(errors.course)} aria-describedby={errors.course ? fieldErrorId('course') : undefined} {...register('course')}/>
                <FieldError id={fieldErrorId('course')} message={errors.course?.message}/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" disabled={isSubmitting} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? fieldErrorId('date') : undefined} {...register('date')}/>
                <FieldError id={fieldErrorId('date')} message={errors.date?.message}/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input id="totalMarks" type="number" min="1" max="500" disabled={isSubmitting} aria-invalid={Boolean(errors.totalMarks)} aria-describedby={errors.totalMarks ? fieldErrorId('totalMarks') : undefined} {...register('totalMarks')}/>
                <FieldError id={fieldErrorId('totalMarks')} message={errors.totalMarks?.message}/>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Controller control={control} name="status" render={({ field }) => (
                  <Select value={field.value} disabled={isSubmitting} onValueChange={field.onChange}>
                    <SelectTrigger id="status" aria-invalid={Boolean(errors.status)} aria-describedby={errors.status ? fieldErrorId('status') : undefined}>
                      <SelectValue placeholder="Select status"/>
                    </SelectTrigger>
                    <SelectContent>
                      {examStatuses.map((status) => (<SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>))}
                    </SelectContent>
                  </Select>
                )}/>
                <FieldError id={fieldErrorId('status')} message={errors.status?.message}/>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to="/exams">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Exam'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
