import { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, UserCheck, UserX, Building2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { StudentsDataTable } from '@/components/students/StudentsDataTable';
import { getStudents, deleteStudent } from '@/services/students.service';
import { toast } from 'sonner';
import { StatsGrid } from '@/components/common/StatsGrid';
import { PageHeader } from '@/components/common/PageHeader';
import { TableSkeleton } from '@/components/common/TableSkeleton';

export function StudentsList() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
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
    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteStudent(deleteTarget.id);
            toast.success('Student deleted successfully.');
            setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
            setTotalCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            toast.error(err.message || 'Failed to delete student.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }, [deleteTarget]);
    const stats = useMemo(() => {
        const total = students.length;
        const active = students.filter((s) => s.status === 'ACTIVE').length;
        const inactive = students.filter((s) => s.status !== 'ACTIVE').length;
        const departments = new Set(students.map((s) => s.department).filter(Boolean)).size;
        return [
            { label: 'Total Students', value: total, icon: Users, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Active', value: active, icon: UserCheck, color: 'text-sky-600 dark:text-sky-400' },
            { label: 'Inactive', value: inactive, icon: UserX, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Departments', value: departments, icon: Building2, color: 'text-violet-600 dark:text-violet-400' },
        ];
    }, [students]);
    return <div className="space-y-6">
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Student"
        description={`Are you sure you want to delete ${deleteTarget?.name || 'this student'}? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
      <PageHeader title="Students" description={`${totalCount} student${totalCount !== 1 ? 's' : ''} registered`} actionLabel="+ Add Student" actionTo="/students/add" loading={loading} />
      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      <StatsGrid items={stats} loading={loading} />
      <Card>
        <CardContent className="p-0">
          {loading ? <TableSkeleton /> : <StudentsDataTable data={students} onDelete={(student) => setDeleteTarget(student)} />}
        </CardContent>
      </Card>
    </div>;
}
