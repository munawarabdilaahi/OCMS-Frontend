import { useCallback, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentsDataTable } from '@/components/students/StudentsDataTable';
import { students as mockStudents } from '@/features/students/students-data';
export function StudentsList() {
    const [students, setStudents] = useState(mockStudents);
    const [deletedId, setDeletedId] = useState('');
    const handleDelete = useCallback((studentId) => {
        const confirmed = window.confirm(`Delete student ${studentId}? This only updates mock frontend data.`);
        if (!confirmed) {
            return;
        }
        setStudents((currentStudents) => currentStudents.filter((student) => student.id !== studentId));
        setDeletedId(studentId);
    }, []);
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Students</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage student records, enrollment status, departments, and academic programs.
        </p>
      </div>

      {deletedId && (<Alert>
          <AlertTitle>Student removed</AlertTitle>
          <AlertDescription>{deletedId} was removed from the mock table data.</AlertDescription>
        </Alert>)}

      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>Search, sort, filter, export, and manage student records.</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentsDataTable data={students} onDelete={handleDelete}/>
        </CardContent>
      </Card>
    </div>);
}
