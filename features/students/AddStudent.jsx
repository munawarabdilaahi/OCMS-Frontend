import { StudentForm } from '@/components/students/StudentForm';
import { PageHeader } from '@/components/common/PageHeader';
import { UnauthorizedPage } from '@/features/UnauthorizedPage';
import { useAuth } from '@/hooks/useAuth';
export function AddStudent() {
    const { can } = useAuth();
    if (!can('students:manage')) {
        return <UnauthorizedPage />;
    }
    return (<div className="space-y-6">
      <PageHeader title="Add Student" description="Register a new student profile and academic enrollment." />
      <StudentForm mode="add"/>
    </div>);
}
