import { useEffect, useState } from 'react';
import { Link, useParams } from '@/lib/router';
import { TeacherForm } from '@/components/teachers/TeacherForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getTeacher } from '@/services/teachers.service';
export default function EditTeacher() {
    const { teacherId } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!teacherId) return;
        getTeacher(teacherId)
            .then((data) => {
                if (!data) { setError('Teacher not found.'); return; }
                const name = data.name || '';
                const nameParts = name.split(' ');
                setTeacher({
                    id: String(data.id || ''),
                    firstName: nameParts[0] || '',
                    lastName: nameParts.slice(1).join(' ') || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    gender: data.gender || 'Male',
                    department: data.department || 'Computer Science',
                    position: data.position || 'Lecturer',
                    qualification: data.qualification || '',
                    employmentDate: data.employment_date ? data.employment_date.split('T')[0] : '',
                    address: data.address || '',
                    status: data.status === 'ACTIVE' ? 'Active' : data.status || 'Active',
                });
            })
            .catch(() => setError('Failed to load teacher.'))
            .finally(() => setLoading(false));
    }, [teacherId]);
    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading teacher...</p></div>;
    }
    if (error || !teacher) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Teacher not found</AlertTitle>
          <AlertDescription>{error || 'The requested teacher record does not exist.'}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/teachers">Back to teachers</Link>
        </Button>
      </div>);
    }
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Edit Teacher</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update {teacher.firstName} {teacher.lastName}'s teacher record.</p>
      </div>
      <TeacherForm mode="edit" defaultValues={teacher}/>
    </div>);
}
