import { TeacherForm } from '@/components/teachers/TeacherForm';
export default function AddTeacher() {
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Add Teacher</h1>
        <p className="mt-1 text-sm text-muted-foreground">Register a new teacher profile and employment record.</p>
      </div>
      <TeacherForm mode="add"/>
    </div>);
}
