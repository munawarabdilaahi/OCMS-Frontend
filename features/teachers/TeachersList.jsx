import { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, UserCheck, UserX, Building2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { TeachersDataTable } from '@/components/teachers/TeachersDataTable';
import { getTeachers, deleteTeacher } from '@/services/teachers.service';
import { toast } from 'sonner';
import { StatsGrid } from '@/components/common/StatsGrid';
import { PageHeader } from '@/components/common/PageHeader';

export default function TeachersList() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
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
    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteTeacher(deleteTarget.id);
            toast.success('Teacher deleted successfully.');
            setTeachers((prev) => prev.filter((t) => t.id !== deleteTarget.id));
        } catch (err) {
            toast.error(err.message || 'Failed to delete teacher.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }, [deleteTarget]);
    const stats = useMemo(() => {
        const total = teachers.length;
        const active = teachers.filter((t) => t.status === 'ACTIVE').length;
        const inactive = teachers.filter((t) => t.status !== 'ACTIVE').length;
        const departments = new Set(teachers.map((t) => t.department).filter(Boolean)).size;
        return [
            { label: 'Total Teachers', value: total, icon: Users, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Active', value: active, icon: UserCheck, color: 'text-sky-600 dark:text-sky-400' },
            { label: 'Inactive', value: inactive, icon: UserX, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Departments', value: departments, icon: Building2, color: 'text-violet-600 dark:text-violet-400' },
        ];
    }, [teachers]);
    return <div className="space-y-6">
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Teacher"
        description={`Are you sure you want to delete ${deleteTarget?.name || 'this teacher'}? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
      <PageHeader title="Teachers" description={`${teachers.length} teacher${teachers.length !== 1 ? 's' : ''} registered`} actionLabel="+ Add Teacher" actionTo="/teachers/add" loading={loading} />
      {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      <StatsGrid items={stats} loading={loading} />
      <Card>
        <CardContent className="p-0">
          {loading ? <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading teachers...</p></div> : <TeachersDataTable data={teachers} onDelete={(teacher) => setDeleteTarget(teacher)} />}
        </CardContent>
      </Card>
    </div>;
}
