import { StudentForm } from '@/components/students/StudentForm';
import { PageHeader } from '@/components/common/PageHeader';
export function AddStudent() {
    return (<div className="space-y-6">
      <PageHeader title="Add Student" description="Register a new student profile and academic enrollment." />
      <StudentForm mode="add"/>
    </div>);
}
