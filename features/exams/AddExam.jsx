import { useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { examStatuses } from '@/features/exams/ExamsList';
import { createExamSchedule } from '@/services/exams.service';
const emptyExam = {
    name: '',
    course: '',
    date: '',
    totalMarks: '',
    status: 'Scheduled',
};
function FieldError({ message }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}
function validateExam(values) {
    const errors = {};
    const totalMarks = Number(values.totalMarks);
    if (!values.name.trim()) errors.name = 'Exam name is required.';
    if (!values.course) errors.course = 'Course is required.';
    if (!values.date) errors.date = 'Date is required.';
    if (!Number.isInteger(totalMarks) || totalMarks < 1 || totalMarks > 500) errors.totalMarks = 'Total marks must be a whole number from 1 to 500.';
    if (!values.status) errors.status = 'Status is required.';
    return errors;
}
export function AddExam() {
    const navigate = useNavigate();
    const [values, setValues] = useState(emptyExam);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    function updateField(name, value) {
        setValues((currentValues) => ({ ...currentValues, [name]: value }));
        setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const normalizedValues = {
            ...values,
            name: values.name.trim(),
            totalMarks: Number(values.totalMarks),
        };
        const validationErrors = validateExam(normalizedValues);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }
        setIsSubmitting(true);
        try {
            await createExamSchedule({
                title: normalizedValues.name,
                course_id: Number(normalizedValues.course),
                exam_date: normalizedValues.date,
                status: normalizedValues.status?.toUpperCase() || 'SCHEDULED',
            });
            toast.success('Exam schedule created.');
            navigate('/exams');
        }
        catch (error) {
            toast.error(error.message || 'Failed to create exam schedule.');
            setIsSubmitting(false);
        }
    }
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Add Exam</h1>
        <p className="mt-1 text-sm text-muted-foreground">Schedule a new course exam or assessment.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
          <CardDescription>Enter exam identity, course, date, marks, and current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Exam Title</Label>
                <Input id="title" placeholder="Programming Midterm" value={values.name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(event) => updateField('name', event.target.value)}/>
                <FieldError message={errors.name}/>
              </div>

              <div className="space-y-2">
                <Label>Course ID</Label>
                <Input placeholder="Course ID" value={values.course} disabled={isSubmitting} aria-invalid={Boolean(errors.course)} onChange={(event) => updateField('course', event.target.value)}/>
                <FieldError message={errors.course}/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={values.date} disabled={isSubmitting} aria-invalid={Boolean(errors.date)} onChange={(event) => updateField('date', event.target.value)}/>
                <FieldError message={errors.date}/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input id="totalMarks" type="number" min="1" max="500" value={values.totalMarks} disabled={isSubmitting} aria-invalid={Boolean(errors.totalMarks)} onChange={(event) => updateField('totalMarks', event.target.value)}/>
                <FieldError message={errors.totalMarks}/>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={values.status} disabled={isSubmitting} onValueChange={(value) => updateField('status', value)}>
                  <SelectTrigger aria-invalid={Boolean(errors.status)}>
                    <SelectValue placeholder="Select status"/>
                  </SelectTrigger>
                  <SelectContent>
                    {examStatuses.map((status) => (<SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.status}/>
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
