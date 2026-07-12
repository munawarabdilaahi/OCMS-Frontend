import { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, UserCheck, UserX, Building2, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentsDataTable } from '@/components/students/StudentsDataTable';
import { getStudents } from '@/services/students.service';
import { Link } from '@/lib/router';
function SkeletonRow() {
    return (<div className="flex items-center gap-4 px-4 py-3">
      <div className="h-4 w-12 animate-pulse rounded bg-muted"/>
      <div className="h-4 w-32 animate-pulse rounded bg-muted"/>
      <div className="h-4 w-40 animate-pulse rounded bg-muted"/>
      <div className="h-4 w-20 animate-pulse rounded bg-muted"/>
      <div className="h-4 w-16 animate-pulse rounded bg-muted"/>
      <div className="h-4 w-24 animate-pulse rounded bg-muted"/>
      <div className="h-5 w-16 animate-pulse rounded-full bg-muted"/>
    </div>);
}
function TableSkeleton() {
    return (<div className="rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <div className="flex gap-16">
          {[80, 100, 120, 70, 60, 90, 70].map((w, i) => (<div key={i} className="h-4 animate-pulse rounded bg-muted" style={{ width: w }}/>))}
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i}/>)}
    </div>);
}
export function StudentsList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletedId, setDeletedId] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    useEffect(() => {
        getStudents()
            .then((response) => {
            const raw = response?.data ?? response ?? [];
            const data = Array.isArray(raw) ? raw : [];
            setStudents(data.map((s) => ({
                ...s,
                name: s.name || s.user?.name || '',
                email: s.email || s.user?.email || '',
                phone: s.phone || s.user?.phone || '',
                department: typeof s.department === 'object' && s.department !== null ? s.department.name : s.department || '',
                gender: s.gender || '',
                status: s.status || '',
            })));
            setTotalCount(response?.meta?.total ?? data.length);
        })
            .catch(() => setError('Failed to load students.'))
            .finally(() => setLoading(false));
    }, []);
    const handleDelete = useCallback((studentId) => {
        setStudents((currentStudents) => currentStudents.filter((student) => student.id !== studentId));
        setDeletedId(studentId);
    }, []);
    const stats = useMemo(() => {
        const total = students.length;
        const active = students.filter((s) => s.status === 'ACTIVE').length;
        const inactive = students.filter((s) => s.status !== 'ACTIVE').length;
        const departments = new Set(students.map((s) => s.department).filter(Boolean)).size;
        return { total, active, inactive, departments };
    }, [students]);
    const statCards = [
        { label: 'Total Students', value: stats.total, icon: Users, color: 'text-emerald-600 dark:text-emerald-400' },
        { label: 'Active', value: stats.active, icon: UserCheck, color: 'text-sky-600 dark:text-sky-400' },
        { label: 'Inactive', value: stats.inactive, icon: UserX, color: 'text-amber-600 dark:text-amber-400' },
        { label: 'Departments', value: stats.departments, icon: Building2, color: 'text-violet-600 dark:text-violet-400' },
    ];
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Students</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${totalCount} student${totalCount !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/students/add">
              <Plus />
              Add Student
            </Link>
          </Button>
        </div>
      </div>

      {error && (<Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>)}

      {deletedId && (<Alert>
          <AlertTitle>Student removed</AlertTitle>
          <AlertDescription>{deletedId} was removed from the system.</AlertDescription>
        </Alert>)}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (<Card key={label}>
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
          {loading ? <TableSkeleton /> : <StudentsDataTable data={students} onDelete={handleDelete}/>}
        </CardContent>
      </Card>
    </div>);
}
