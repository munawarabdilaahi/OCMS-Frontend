import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, Building2, Download, MapPin, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
import { getCampuses, deleteCampus } from '@/services/campus.service';
import { cn } from '@/lib/cn';

const statusStyles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-muted text-muted-foreground',
    SUSPENDED: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    CLOSED: 'bg-red-500/10 text-red-700 dark:text-red-300',
};

const typeLabels = {
    MAIN: 'Main',
    BRANCH: 'Branch',
    VIRTUAL: 'Virtual',
    SATELLITE: 'Satellite',
    OTHER: 'Other',
};

function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}

function exportCampuses(rows) {
    if (!rows.length) return;
    const headers = ['Code', 'Name', 'Type', 'University', 'Director', 'Phone', 'Email', 'Status'];
    const body = rows.map((row) => {
        const c = row.original;
        return [c.code, c.name, typeLabels[c.type] || c.type, c.university_name || '', c.campus_director || '', c.phone || '', c.email || '', c.status];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-campuses.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}

function CampusesDataTable({ data, onDelete }) {
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
            accessorKey: 'type',
            header: ({ column }) => <SortButton column={column}>Type</SortButton>,
            cell: ({ row }) => <Badge variant="outline">{typeLabels[row.original.type] || row.original.type || '-'}</Badge>,
        },
        {
            accessorKey: 'university_name',
            header: ({ column }) => <SortButton column={column}>University</SortButton>,
            cell: ({ row }) => row.original.university_name || '-',
        },
        {
            accessorKey: 'campus_director',
            header: 'Director',
            cell: ({ row }) => row.original.campus_director || '-',
        },
        {
            accessorKey: 'faculty_count',
            header: ({ column }) => <SortButton column={column}>Faculties</SortButton>,
            cell: ({ row }) => (
                <span className="inline-flex items-center gap-1">
                    <Building2 className="size-3.5 text-muted-foreground"/>
                    {row.original.faculty_count || 0}
                </span>
            ),
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
                <Link to={`/campus/${row.original.id}/edit`}>
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
          <Button type="button" variant="outline" onClick={() => exportCampuses(table.getFilteredRowModel().rows)}>
            <Download />
            Export
          </Button>
          <Button asChild>
            <Link to="/campus/add">
              <Plus />
              Add Campus
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
                  <EmptyState title="No campuses found" description="Create a campus to get started." actionLabel="Add Campus" actionTo="/campus/add"/>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} campuses
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

export function CampusesList() {
    const [campuses, setCampuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const searchTimer = useRef(null);

    const totalFaculties = useMemo(() => campuses.reduce((sum, c) => sum + (c.faculty_count || 0), 0), [campuses]);
    const activeCount = useMemo(() => campuses.filter((c) => c.status === 'ACTIVE').length, [campuses]);

    const fetchCampuses = useCallback(() => {
        setLoading(true);
        setError('');
        const params = {};
        if (typeFilter) params.type = typeFilter;
        if (statusFilter) params.status = statusFilter;
        if (searchFilter) params.search = searchFilter;
        getCampuses(params)
            .then((data) => {
            setCampuses(Array.isArray(data) ? data : []);
        })
            .catch((err) => setError(err.message || 'Failed to load campuses.'))
            .finally(() => setLoading(false));
    }, [typeFilter, statusFilter, searchFilter]);

    useEffect(() => {
        fetchCampuses();
    }, [fetchCampuses]);

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteCampus(deleteTarget.id);
            toast.success('Campus deleted successfully.');
            setCampuses((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        } catch (err) {
            toast.error(err.message || 'Failed to delete campus.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }, [deleteTarget]);

    return (<div className="space-y-6">
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Campus"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Campuses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${campuses.length} campus${campuses.length !== 1 ? 'es' : ''} registered`}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <MapPin className="size-5"/>
        </span>
      </div>

      {!loading && campuses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard label="Total Campuses" value={campuses.length} icon={MapPin} />
          <StatsCard label="Active Campuses" value={activeCount} icon={Building2} />
          <StatsCard label="Total Faculties" value={totalFaculties} icon={Building2} />
        </div>
      )}

      {error && (<Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>)}

      <Card>
        <CardHeader>
          <CardTitle>Campus Directory</CardTitle>
          <CardDescription>Search, filter, paginate, export, and manage campus records.</CardDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
              <Input className="pl-9" placeholder="Search campuses..." value={searchInput} onChange={(e) => {
                setSearchInput(e.target.value);
                if (searchTimer.current) clearTimeout(searchTimer.current);
                searchTimer.current = setTimeout(() => setSearchFilter(e.target.value), 300);
              }}/>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Types</option>
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
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
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <p className="text-muted-foreground">Loading campuses...</p>
            </div>
          ) : (
            <CampusesDataTable data={campuses} onDelete={handleDelete}/>
          )}
        </CardContent>
      </Card>
    </div>);
}