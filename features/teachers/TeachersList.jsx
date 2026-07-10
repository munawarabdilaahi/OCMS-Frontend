import { useState } from 'react';
import { useNavigate } from '@/lib/router';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeachersDataTable } from '@/components/teachers/TeachersDataTable';
import { deleteTeacher, getTeachers } from './teachers-data';
export default function TeachersList() {
    const navigate = useNavigate();
    const [data, setData] = useState(() => getTeachers());
    const handleDelete = (id) => {
        deleteTeacher(id);
        setData(getTeachers());
        toast.success('Teacher deleted successfully.');
    };
    return (<div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers Management</h1>
          <p className="text-muted-foreground">Manage and monitor faculty members.</p>
        </div>
        <Button onClick={() => navigate('/teachers/add')}>
          <UserPlus className="mr-2 h-4 w-4"/> Add Teacher
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Faculty Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <TeachersDataTable data={data} onDelete={handleDelete}/>
        </CardContent>
      </Card>
    </div>);
}
