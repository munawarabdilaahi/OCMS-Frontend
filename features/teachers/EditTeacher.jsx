import { useNavigate, useParams } from '@/lib/router';
import { TeacherForm } from '@/components/teachers/TeacherForm';
import { getTeacherById, updateTeacher } from './teachers-data';
export default function EditTeacher() {
    const { id } = useParams();
    const navigate = useNavigate();
    const teacher = getTeacherById(id);
    const handleSubmit = (updatedTeacher) => {
        updateTeacher({ ...updatedTeacher, id });
        navigate('/teachers');
    };
    if (!teacher) {
        return (<div className="p-6">
        <p className="text-muted-foreground">Teacher not found.</p>
      </div>);
    }
    return (<div className="p-6">
      <TeacherForm initialData={teacher} onSubmit={handleSubmit} mode="edit"/>
    </div>);
}
