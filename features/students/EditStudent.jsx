import { useEffect, useState } from 'react';
import { Link, useParams } from '@/lib/router';
import { StudentForm } from '@/components/students/StudentForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getStudent } from '@/services/students.service';
export function EditStudent() {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!studentId) return;
        getStudent(studentId)
            .then((response) => {
            const data = response?.data ?? response;
            if (!data) { setError('Student not found.'); return; }
            const name = data.name || data.user?.name || '';
            const nameParts = name.split(' ');
            const dept = typeof data.department === 'object' && data.department !== null ? data.department.name : data.department || '';
            const status = data.status || 'ACTIVE';
            setStudent({
                id: String(data.id || ''),
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                gender: data.gender || 'Other',
                dateOfBirth: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
                email: data.email || data.user?.email || '',
                phone: data.phone || data.user?.phone || '',
                address: data.address || '',
                department: dept || 'Computer Science',
                status: status.charAt(0) + status.slice(1).toLowerCase(),
            });
        })
            .catch(() => setError('Failed to load student.'))
            .finally(() => setLoading(false));
    }, [studentId]);
    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading student...</p></div>;
    }
    if (error || !student) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Student not found</AlertTitle>
          <AlertDescription>{error || 'The requested student record does not exist.'}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/students">Back to students</Link>
        </Button>
      </div>);
    }
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Edit Student</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update {student.firstName} {student.lastName}'s student record.</p>
      </div>
      <StudentForm mode="edit" defaultValues={student}/>
    </div>);
}
