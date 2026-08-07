import { TeacherForm } from '@/components/teachers/TeacherForm';
import { PageHeader } from '@/components/common/PageHeader';
export function AddTeacher() {
    return (<div className="space-y-6">
      <PageHeader title="Add Teacher" description="Register a new teacher profile and employment record." />
      <TeacherForm mode="add"/>
    </div>);
}
