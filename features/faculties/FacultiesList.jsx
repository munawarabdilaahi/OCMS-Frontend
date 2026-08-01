import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, Download, Landmark, MoreHorizontal, Pencil, Plus, Search, Trash2, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { getFaculties, deleteFaculty } from '@/services/faculties.service';
import { cn } from '@/lib/cn';

const statusStyles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-muted text-muted-foreground',
    SUSPENDED: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    CLOSED: 'bg-red-500/10 text-red-700 dark:text-red-300',
};

function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}

function exportFaculties(rows) {
    if (!rows.length) return;
    const headers = ['Code', 'Name', 'Campus', 'Dean', 'Departments', 'Phone', 'Email', 'Status'];
    const body = rows.map((row) => {
        const f = row.original;
        return [f.code, f.name, f.campus_name || '', f.dean_name || '', f.department_count || 0, f.phone || '', f.email || '', f.status];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-faculties.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}

function FacultiesDataTable({ data, onDelete }) {
    const [sorting, setSorting] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'code',
            header: ({ column }) => <SortButton column={column}>Code</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.code || '-'}</span>,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => <SortButton column={column}>Name</SortButton>,
        },
        {
            accessorKey: 'campus_name',
            header: ({ column }) => <SortButton column={column}>Campus</SortButton>,
            cell: ({ row }) => row.original.campus_name || '-',
        },
        {
            accessorKey: 'dean_name',
            header: 'Dean',
            cell: ({ row }) => row.original.dean_name || '-',
        },
        {
            accessorKey: 'department_count',
            header: ({ column }) => <SortButton column={column}>Depts</SortButton>,
            cell: ({ row }) => row.original.department_count || 0,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (<Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status || 'ACTIVE'}</Badge>),
        },
        {
            id: 'actions',
            header: 'Actions',
            enableHiding: false,
            cell: ({ row }) => (<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon">
                <MoreHorizontal />
                <span className="sr-only">Open row actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/faculties/${row.original.id}/edit`}>
                  <Pencil />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.original)}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>),
        },
    ], [onDelete]);
    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        initialState: { pagination: { pageSize: 10 } },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return (<div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => exportFaculties(table.getFilteredRowModel().rows)}>
            <Download />
            Export
          </Button>
          <Button asChild>
            <Link to="/faculties/add">
              <Plus />
              Add Faculty
            </Link>
          </Button>
        </div>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (<TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (<TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>))}
              </TableRow>))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => (<TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}
                </TableRow>))) : (<TableRow>
                <TableCell colSpan={columns.length} className="p-6">
                  <EmptyState title="No faculties found" description="Create a faculty to get started." actionLabel="Add Faculty" actionTo="/faculties/add"/>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} faculties
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <Button type="button" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>);
}

function StatsCard({ label, value, icon: Icon }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-5" />
            </div>
            <div>
                <p className="text-2xl font-semibold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </div>
    );
}

export function FacultiesList() {
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [campusFilter, setCampusFilter] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const searchTimer = useRef(null);

    const totalDepartments = useMemo(() => faculties.reduce((sum, f) => sum + (f.department_count || 0), 0), [faculties]);
    const activeCount = useMemo(() => faculties.filter((f) => f.status === 'ACTIVE').length, [faculties]);

    const fetchFaculties = useCallback(() => {
        setLoading(true);
        setError('');
        const params = {};
        if (statusFilter) params.status = statusFilter;
        if (campusFilter) params.campus_id = campusFilter;
        if (searchFilter) params.search = searchFilter;
        getFaculties(params)
            .then((data) => {
            setFaculties(Array.isArray(data) ? data : []);
        })
            .catch((err) => setError(err.message || 'Failed to load faculties.'))
            .finally(() => setLoading(false));
    }, [statusFilter, campusFilter, searchFilter]);

    useEffect(() => {
        fetchFaculties();
    }, [fetchFaculties]);

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteFaculty(deleteTarget.id);
            toast.success('Faculty deleted successfully.');
            setFaculties((prev) => prev.filter((f) => f.id !== deleteTarget.id));
        } catch (err) {
            toast.error(err.message || 'Failed to delete faculty.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }, [deleteTarget]);

    return (<div className="space-y-6">
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Faculty"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Faculties</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${faculties.length} facult${faculties.length !== 1 ? 'ies' : 'y'} registered`}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Landmark className="size-5"/>
        </span>
      </div>

      {!loading && faculties.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard label="Total Faculties" value={faculties.length} icon={Landmark} />
          <StatsCard label="Active Faculties" value={activeCount} icon={Users} />
          <StatsCard label="Total Departments" value={totalDepartments} icon={Users} />
        </div>
      )}

      {error && (<Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>)}

      <Card>
        <CardHeader>
          <CardTitle>Faculty Directory</CardTitle>
          <CardDescription>Search, filter, paginate, export, and manage faculty records.</CardDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
              <Input className="pl-9" placeholder="Search faculties..." value={searchInput} onChange={(e) => {
                setSearchInput(e.target.value);
                if (searchTimer.current) clearTimeout(searchTimer.current);
                searchTimer.current = setTimeout(() => setSearchFilter(e.target.value), 300);
              }}/>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select
              value={campusFilter}
              onChange={(e) => setCampusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Campuses</option>
              {Object.entries(
                faculties.reduce((acc, f) => {
                  if (f.campus_id && f.campus_name) acc[f.campus_id] = f.campus_name;
                  return acc;
                }, {})
              ).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <p className="text-muted-foreground">Loading faculties...</p>
            </div>
          ) : (
            <FacultiesDataTable data={faculties} onDelete={handleDelete}/>
          )}
        </CardContent>
      </Card>
    </div>);
}