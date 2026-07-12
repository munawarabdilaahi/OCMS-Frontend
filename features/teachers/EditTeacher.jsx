import { useNavigate, useParams } from '@/lib/router';
import { TeacherForm } from '@/components/teachers/TeacherForm';
export default function EditTeacher() {
    const { id } = useParams();
    const navigate = useNavigate();
    const handleSubmit = (updatedTeacher) => {
        navigate('/teachers');
    };
    return (<div className="p-6">
      <TeacherForm initialData={null} onSubmit={handleSubmit} mode="edit"/>
    </div>);
}
