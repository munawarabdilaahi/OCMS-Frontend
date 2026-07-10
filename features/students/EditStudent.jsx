import { Link, useParams } from '@/lib/router';
import { StudentForm } from '@/components/students/StudentForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getStudentById, getStudentFullName } from '@/features/students/students-data';
export function EditStudent() {
    const { studentId } = useParams();
    const student = getStudentById(studentId);
    if (!student) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Student not found</AlertTitle>
          <AlertDescription>The requested mock student record does not exist.</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/students">Back to students</Link>
        </Button>
      </div>);
    }
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Edit Student</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update {getStudentFullName(student)}'s student record.</p>
      </div>
      <StudentForm mode="edit" defaultValues={student}/>
    </div>);
}
