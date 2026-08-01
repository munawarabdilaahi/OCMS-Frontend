import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, Building2, Download, LayoutDashboard, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDepartmentsWithMeta as getDepartments, deleteDepartment } from '@/services/departments.service';

const statusColors = { ACTIVE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400', SUSPENDED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', CLOSED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };

function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}

function exportDepartments(allData) {
    if (!allData.length) return;
    const headers = ['Code', 'Name', 'Faculty', 'Status', 'Programs', 'Teachers', 'Courses', 'Students'];
    const body = allData.map((d) => [d.code, d.name, d.faculty_name, d.status, d.program_count, d.teacher_count, d.course_count, d.student_count]);
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-departments.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}

function DepartmentsDataTable({ data, onDelete }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const columns = useMemo(() => [
        { accessorKey: 'code', header: ({ column }) => <SortButton column={column}>Code</SortButton>, cell: ({ row }) => <span className="font-medium">{row.original.code || '-'}</span> },
        { accessorKey: 'name', header: ({ column }) => <SortButton column={column}>Department Name</SortButton> },
        { accessorKey: 'faculty_name', header: ({ column }) => <SortButton column={column}>Faculty</SortButton> },
        { accessorKey: 'status', header: ({ column }) => <SortButton column={column}>Status</SortButton>, cell: ({ row }) => (<Badge className={`${statusColors[row.original.status] || ''} border-0`} variant="outline">{row.original.status}</Badge>) },
        { accessorKey: 'program_count', header: ({ column }) => <SortButton column={column}>Programs</SortButton>, cell: ({ row }) => <span>{(row.original.program_count || 0).toLocaleString()}</span> },
        { accessorKey: 'course_count', header: ({ column }) => <SortButton column={column}>Courses</SortButton>, cell: ({ row }) => <span>{(row.original.course_count || 0).toLocaleString()}</span> },
        { id: 'actions', header: 'Actions', enableHiding: false, cell: ({ row }) => (<DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="ghost" size="icon"><MoreHorizontal /><span className="sr-only">Open row actions</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link to={`/departments/${row.original.id}/edit`}><Pencil />Edit</Link></DropdownMenuItem><DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.original)}><Trash2 />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>) },
    ], [onDelete]);
    const table = useReactTable({ data, columns, state: { sorting, globalFilter }, initialState: { pagination: { pageSize: 10 } }, onSortingChange: setSorting, onGlobalFilterChange: setGlobalFilter, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel() });
    return (<div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>{table.getHeaderGroups().map((hg) => (<TableRow key={hg.id}>{hg.headers.map((h) => (<TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}</TableRow>))}</TableHeader>
          <TableBody>{table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => (<TableRow key={row.id}>{row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}</TableRow>)) : (<TableRow><TableCell colSpan={columns.length} className="p-6"><EmptyState title="No departments found" description="Create a department to get started." actionLabel="Add Department" actionTo="/departments/add"/></TableCell></TableRow>)}</TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} departments</p><div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button><span className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span><Button type="button" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button></div></div>
    </div>);
}

export function DepartmentsList() {
    const [departments, setDepartments] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [facultyFilter, setFacultyFilter] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const fetchDepartments = useCallback(() => {
        setLoading(true);
        setError('');
        const params = { page, pageSize };
        if (search.trim()) params.search = search.trim();
        if (statusFilter) params.status = statusFilter;
        if (facultyFilter) params.faculty_id = facultyFilter;
        getDepartments(params)
            .then(({ data, meta }) => {
                setDepartments(Array.isArray(data) ? data : []);
                setTotalCount(meta?.total ?? 0);
            })
            .catch((err) => setError(err.message || 'Failed to load departments.'))
            .finally(() => setLoading(false));
    }, [search, statusFilter, facultyFilter, page]);

    useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteDepartment(deleteTarget.id);
            toast.success('Department deleted successfully.');
            fetchDepartments();
        } catch (err) {
            toast.error(err.message || 'Failed to delete department.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }, [deleteTarget, fetchDepartments]);

    const pageCount = Math.ceil(totalCount / pageSize);
    const uniqueFaculties = useMemo(() => { const m = {}; departments.forEach((d) => { if (d.faculty_id && d.faculty_name) m[d.faculty_id] = d.faculty_name; }); return Object.entries(m); }, [departments]);

    return (<div className="space-y-6">
      <ConfirmationDialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }} title="Delete Department" description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} confirmLabel="Delete" loading={deleting} onConfirm={handleDelete}/>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Departments</h1><p className="mt-1 text-sm text-muted-foreground">{loading ? 'Loading...' : `${totalCount} department${totalCount !== 1 ? 's' : ''} registered`}</p></div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><Building2 className="size-5"/></span>
      </div>
      {error && (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}
      <Card>
        <CardHeader><CardTitle>Department Directory</CardTitle><CardDescription>Search, filter, paginate, export, and manage department records.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative max-w-sm flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input className="pl-9" placeholder="Search departments..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}/></div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="">All Statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option><option value="CLOSED">Closed</option></select>
            <select value={facultyFilter} onChange={(e) => { setFacultyFilter(e.target.value); setPage(1); }} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="">All Faculties</option>{uniqueFaculties.map(([id, name]) => (<option key={id} value={id}>{name}</option>))}</select>
            <div className="flex gap-2"><Button type="button" variant="outline" onClick={() => exportDepartments(departments)}><Download />Export</Button><Button asChild><Link to="/departments/add"><Plus />Add Department</Link></Button></div>
          </div>
          {loading ? (<div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading departments...</p></div>) : (<DepartmentsDataTable data={departments} onDelete={(d) => setDeleteTarget(d)}/>)}
          {!loading && departments.length > 0 && (<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalCount)} of {totalCount} departments</p><div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Previous</Button><span className="text-sm text-muted-foreground">Page {page} of {pageCount || 1}</span><Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount}>Next</Button></div></div>)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><LayoutDashboard className="size-4"/>Department Snapshot</CardTitle><CardDescription>Aggregate stats from all departments in the system.</CardDescription></CardHeader>
        <CardContent><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Total Departments</p><p className="text-2xl font-bold">{totalCount}</p></div><div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Active Departments</p><p className="text-2xl font-bold">{departments.filter((d) => d.status === 'ACTIVE').length}</p></div><div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Total Programs</p><p className="text-2xl font-bold">{departments.reduce((sum, d) => sum + (d.program_count || 0), 0)}</p></div><div className="rounded-lg border bg-card p-4"><p className="text-sm text-muted-foreground">Total Students</p><p className="text-2xl font-bold">{departments.reduce((sum, d) => sum + (d.student_count || 0), 0)}</p></div></div></CardContent>
      </Card>
    </div>);
}
