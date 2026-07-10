import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { examCourses, examStatuses, saveExam } from '@/features/exams/ExamsList';
const emptyExam = {
    name: '',
    course: '',
    date: '',
    totalMarks: '',
    status: 'Scheduled',
};
function FieldError({ message }) {
    if (!message) {
        return null;
    }
    return <p className="text-sm text-destructive">{message}</p>;
}
function validateExam(values) {
    const errors = {};
    const totalMarks = Number(values.totalMarks);
    if (!values.name.trim()) {
        errors.name = 'Exam name is required.';
    }
    if (!values.course) {
        errors.course = 'Course is required.';
    }
    if (!values.date) {
        errors.date = 'Date is required.';
    }
    if (!Number.isInteger(totalMarks) || totalMarks < 1 || totalMarks > 500) {
        errors.totalMarks = 'Total marks must be a whole number from 1 to 500.';
    }
    if (!values.status) {
        errors.status = 'Status is required.';
    }
    return errors;
}
export function AddExam() {
    const navigate = useNavigate();
    const [values, setValues] = useState(emptyExam);
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
            name: values.name.trim(),
            totalMarks: Number(values.totalMarks),
        };
        const validationErrors = validateExam(normalizedValues);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }
        setIsSubmitting(true);
        await new Promise((resolve) => window.setTimeout(resolve, 500));
        saveExam(normalizedValues);
        setSaved(true);
        navigate('/exams');
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
            {saved && (<Alert variant="success">
                <AlertTitle>Exam saved</AlertTitle>
                <AlertDescription>This mock form is ready for backend integration.</AlertDescription>
              </Alert>)}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Exam Name</Label>
                <Input id="name" placeholder="Programming Midterm" value={values.name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(event) => updateField('name', event.target.value)}/>
                <FieldError message={errors.name}/>
              </div>

              <div className="space-y-2">
                <Label>Course</Label>
                <Select value={values.course} disabled={isSubmitting} onValueChange={(value) => updateField('course', value)}>
                  <SelectTrigger aria-invalid={Boolean(errors.course)}>
                    <SelectValue placeholder="Select course"/>
                  </SelectTrigger>
                  <SelectContent>
                    {examCourses.map((course) => (<SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
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
                {isSubmitting ? <Loader2 className="animate-spin"/> : <Save />}
                {isSubmitting ? 'Saving' : 'Save Exam'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
