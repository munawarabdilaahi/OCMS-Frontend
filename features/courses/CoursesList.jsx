import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, BookOpen, Download, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { ROLES } from '@/lib/roles';
import { getCourses, deleteCourse } from '@/services/courses.service';
import { SortButton } from '@/components/ui/data-table';

const statusStyles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-muted text-muted-foreground',
};

export function CoursesList() {
    const { user } = useAuth();
    const isStudent = user?.role === ROLES.STUDENT;
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;
    const [sorting, setSorting] = useState([]);

    const fetchCourses = useCallback(() => {
        setLoading(true);
        setError('');
        const params = { page, pageSize };
        if (search.trim()) params.search = search.trim();
        if (statusFilter) params.status = statusFilter;
        getCourses(params)
            .then((response) => {
                const data = response?.data ?? response ?? [];
                setCourses(Array.isArray(data) ? data : []);
                setTotalCount(response?.meta?.total ?? data.length);
            })
            .catch(() => setError('Failed to load courses.'))
            .finally(() => setLoading(false));
    }, [search, statusFilter, page]);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteCourse(deleteTarget.id);
            toast.success('Course deleted successfully.');
            fetchCourses();
        } catch (err) {
            toast.error(err.message || 'Failed to delete course.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }, [deleteTarget, fetchCourses]);

    const columns = useMemo(() => [
        { accessorKey: 'code', header: ({ column }) => <SortButton column={column}>Code</SortButton>, cell: ({ row }) => <span className="font-medium">{row.original.code || '-'}</span> },
        { accessorKey: 'title', header: ({ column }) => <SortButton column={column}>Course Name</SortButton> },
        { accessorKey: 'credit_hours', header: ({ column }) => <SortButton column={column}>Credits</SortButton>, cell: ({ row }) => row.original.credit_hours ?? '-' },
        { accessorKey: 'department', header: ({ column }) => <SortButton column={column}>Department</SortButton> },
        { accessorKey: 'teacher', header: ({ column }) => <SortButton column={column}>Teacher</SortButton>, cell: ({ row }) => row.original.teacher || '-' },
        { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status}</Badge> },
        { id: 'actions', header: 'Actions', enableHiding: false, cell: ({ row }) => (<DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="ghost" size="icon"><MoreHorizontal /><span className="sr-only">Open row actions</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link to={`/courses/${row.original.id}/edit`}><Pencil />Edit</Link></DropdownMenuItem><DropdownMenuItem className="text-destructive" onSelect={() => setDeleteTarget({ id: row.original.id, title: row.original.title })}><Trash2 />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>) },
    ], []);

    const table = useReactTable({ data: courses, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });
    const pageCount = Math.ceil(totalCount / pageSize);

    return (<div className="space-y-6">
      <ConfirmationDialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }} title="Delete Course" description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`} confirmLabel="Delete" loading={deleting} onConfirm={handleDelete}/>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">{isStudent ? 'My Courses' : 'Courses'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{loading ? 'Loading...' : `${totalCount} course${totalCount !== 1 ? 's' : ''} registered`}</p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><BookOpen className="size-5"/></span>
      </div>
      {error && (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}
      <Card>
        <CardHeader>
          <CardTitle>{isStudent ? 'My Course Directory' : 'Course Directory'}</CardTitle>
          <CardDescription>Search, filter, paginate, and manage course records.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
              <Input className="pl-9" placeholder="Search courses..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}/>
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          {loading ? (<div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading courses...</p></div>) : (<div className="space-y-4">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>{table.getHeaderGroups().map((hg) => (<TableRow key={hg.id}>{hg.headers.map((h) => (<TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}</TableRow>))}</TableHeader>
                <TableBody>{table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => (<TableRow key={row.id}>{row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}</TableRow>)) : (<TableRow><TableCell colSpan={columns.length} className="p-6"><EmptyState title="No courses found" description="Create a course to get started." actionLabel="Add Course" actionTo="/courses/add"/></TableCell></TableRow>)}</TableBody>
              </Table>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalCount)} of {totalCount} courses</p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {page} of {pageCount || 1}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount}>Next</Button>
              </div>
            </div>
          </div>)}
        </CardContent>
      </Card>
    </div>);
}
