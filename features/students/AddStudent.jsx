import { StudentForm } from '@/components/students/StudentForm';
export function AddStudent() {
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Add Student</h1>
        <p className="mt-1 text-sm text-muted-foreground">Register a new student profile and academic enrollment.</p>
      </div>
      <StudentForm mode="add"/>
    </div>);
}
