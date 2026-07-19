import { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, UserCheck, UserX, Building2, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeachersDataTable } from '@/components/teachers/TeachersDataTable';
import { getTeachers, deleteTeacher } from '@/services/teachers.service';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
export default function TeachersList() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        getTeachers()
            .then((response) => {
                const raw = response?.data ?? response ?? [];
                const data = Array.isArray(raw) ? raw : [];
                setTeachers(data);
            })
            .catch(() => setError('Failed to load teachers.'))
            .finally(() => setLoading(false));
    }, []);
    const handleDelete = useCallback(async (teacherId) => {
        if (!window.confirm('Delete this teacher? This action cannot be undone.')) return;
        try {
            await deleteTeacher(teacherId);
            toast.success('Teacher deleted successfully.');
            setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
        } catch (err) {
            toast.error(err.message || 'Failed to delete teacher.');
        }
    }, []);
    const stats = useMemo(() => {
        const total = teachers.length;
        const active = teachers.filter((t) => t.status === 'ACTIVE').length;
        const inactive = teachers.filter((t) => t.status !== 'ACTIVE').length;
        const departments = new Set(teachers.map((t) => t.department).filter(Boolean)).size;
        return { total, active, inactive, departments };
    }, [teachers]);
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Teachers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${stats.total} teacher${stats.total !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/teachers/add">
              <Plus />
              Add Teacher
            </Link>
          </Button>
        </div>
      </div>

      {error && (<Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>)}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Teachers', value: stats.total, icon: Users, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Active', value: stats.active, icon: UserCheck, color: 'text-sky-600 dark:text-sky-400' },
          { label: 'Inactive', value: stats.inactive, icon: UserX, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Departments', value: stats.departments, icon: Building2, color: 'text-violet-600 dark:text-violet-400' },
        ].map(({ label, value, icon: Icon, color }) => (<Card key={label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className={`size-5 ${color}`}/>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{loading ? '—' : value}</p>
          </CardContent>
        </Card>))}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <p className="text-muted-foreground">Loading teachers...</p>
            </div>
          ) : (
            <TeachersDataTable data={teachers} onDelete={handleDelete}/>
          )}
        </CardContent>
      </Card>
    </div>);
}
