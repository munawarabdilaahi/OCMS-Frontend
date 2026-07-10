import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { courseDepartments, courseSemesters, courseStatuses, courseTeachers, getCourseByCode, saveCourse, } from '@/features/courses/CoursesList';
function FieldError({ message }) {
    if (!message) {
        return null;
    }
    return <p className="text-sm text-destructive">{message}</p>;
}
function validateCourse(values) {
    const errors = {};
    const creditHours = Number(values.creditHours);
    if (!values.name.trim()) {
        errors.name = 'Course name is required.';
    }
    if (!values.description.trim()) {
        errors.description = 'Description is required.';
    }
    if (!Number.isInteger(creditHours) || creditHours < 1 || creditHours > 6) {
        errors.creditHours = 'Credit hours must be a whole number from 1 to 6.';
    }
    if (!values.department) {
        errors.department = 'Department is required.';
    }
    if (!values.teacher) {
        errors.teacher = 'Assigned teacher is required.';
    }
    if (!values.semester) {
        errors.semester = 'Semester is required.';
    }
    if (!values.status) {
        errors.status = 'Status is required.';
    }
    return errors;
}
export function EditCourse() {
    const { courseCode } = useParams();
    const navigate = useNavigate();
    const course = getCourseByCode(courseCode);
    const [values, setValues] = useState(() => course ?? null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    if (!values) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Course not found</AlertTitle>
          <AlertDescription>The requested mock course record does not exist.</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/courses">Back to courses</Link>
        </Button>
      </div>);
    }
    function updateField(name, value) {
        setValues((currentValues) => ({ ...currentValues, [name]: value }));
        setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const normalizedValues = {
            ...values,
            name: values.name.trim(),
            description: values.description.trim(),
            creditHours: Number(values.creditHours),
        };
        const validationErrors = validateCourse(normalizedValues);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }
        setIsSubmitting(true);
        await new Promise((resolve) => window.setTimeout(resolve, 500));
        saveCourse(normalizedValues);
        setSaved(true);
        navigate(`/courses/${values.code}`);
    }
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Edit Course</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update {values.name}'s course record.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Modify the course assignment, semester, credit hours, and status.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {saved && (<Alert variant="success">
                <AlertTitle>Course saved</AlertTitle>
                <AlertDescription>This mock form is ready for backend integration.</AlertDescription>
              </Alert>)}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input id="code" value={values.code} disabled/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input id="name" value={values.name} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} onChange={(event) => updateField('name', event.target.value)}/>
                <FieldError message={errors.name}/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditHours">Credit Hours</Label>
                <Input id="creditHours" type="number" min="1" max="6" value={values.creditHours} disabled={isSubmitting} aria-invalid={Boolean(errors.creditHours)} onChange={(event) => updateField('creditHours', event.target.value)}/>
                <FieldError message={errors.creditHours}/>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={values.department} disabled={isSubmitting} onValueChange={(value) => updateField('department', value)}>
                  <SelectTrigger aria-invalid={Boolean(errors.department)}>
                    <SelectValue placeholder="Select department"/>
                  </SelectTrigger>
                  <SelectContent>
                    {courseDepartments.map((department) => (<SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.department}/>
              </div>

              <div className="space-y-2">
                <Label>Assigned Teacher</Label>
                <Select value={values.teacher} disabled={isSubmitting} onValueChange={(value) => updateField('teacher', value)}>
                  <SelectTrigger aria-invalid={Boolean(errors.teacher)}>
                    <SelectValue placeholder="Select teacher"/>
                  </SelectTrigger>
                  <SelectContent>
                    {courseTeachers.map((teacher) => (<SelectItem key={teacher} value={teacher}>
                        {teacher}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.teacher}/>
              </div>

              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={values.semester} disabled={isSubmitting} onValueChange={(value) => updateField('semester', value)}>
                  <SelectTrigger aria-invalid={Boolean(errors.semester)}>
                    <SelectValue placeholder="Select semester"/>
                  </SelectTrigger>
                  <SelectContent>
                    {courseSemesters.map((semester) => (<SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.semester}/>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={values.status} disabled={isSubmitting} onValueChange={(value) => updateField('status', value)}>
                  <SelectTrigger aria-invalid={Boolean(errors.status)}>
                    <SelectValue placeholder="Select status"/>
                  </SelectTrigger>
                  <SelectContent>
                    {courseStatuses.map((status) => (<SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.status}/>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={values.description} disabled={isSubmitting} aria-invalid={Boolean(errors.description)} onChange={(event) => updateField('description', event.target.value)}/>
              <FieldError message={errors.description}/>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link to={`/courses/${values.code}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin"/> : <Save />}
                {isSubmitting ? 'Saving' : 'Update Course'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
