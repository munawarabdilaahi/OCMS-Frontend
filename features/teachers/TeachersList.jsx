import { useCallback, useEffect, useState } from 'react';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { TeachersDataTable } from '@/components/teachers/TeachersDataTable';
import { getTeachers, deleteTeacher } from '@/services/teachers.service';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common/PageHeader';
import { TableSkeleton } from '@/components/common/TableSkeleton';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function TeachersList() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const fetchTeachers = useCallback(() => {
        setLoading(true);
        setError('');
        const params = { page, pageSize };
        if (search.trim()) params.search = search.trim();
        if (statusFilter) params.status = statusFilter;
        getTeachers(params)
            .then((response) => {
                const raw = response?.data ?? response ?? [];
                const data = Array.isArray(raw) ? raw : [];
                setTeachers(data);
                setTotalCount(response?.meta?.total ?? data.length);
            })
            .catch(() => setError('Failed to load teachers.'))
            .finally(() => setLoading(false));
    }, [search, statusFilter, page]);

    useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteTeacher(deleteTarget.id);
            toast.success('Teacher deleted successfully.');
            fetchTeachers();
        } catch (err) {
            toast.error(err.message || 'Failed to delete teacher.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }, [deleteTarget, fetchTeachers]);

    const pageCount = Math.ceil(totalCount / pageSize);

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
      <PageHeader title="Teachers" description={`${totalCount} teacher${totalCount !== 1 ? 's' : ''} registered`} actionLabel="+ Add Teacher" actionTo="/teachers/add" loading={loading} />
      <ErrorAlert message={error} onRetry={fetchTeachers} />
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
              <Input className="pl-9" placeholder="Search teachers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}/>
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          {loading ? <TableSkeleton /> : <TeachersDataTable data={teachers} onDelete={setDeleteTarget} />}
          {!loading && teachers.length > 0 && (<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalCount)} of {totalCount} teachers</p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {page} of {pageCount || 1}</span>
              <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount}>Next</Button>
            </div>
          </div>)}
        </CardContent>
      </Card>
    </div>;
}
