import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, Building2, Download, GraduationCap, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { EmptyState } from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/TableSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { getUniversities, deleteUniversity } from '@/services/universities.service';
import { cn } from '@/lib/cn';
import { SortButton } from '@/components/ui/data-table';

import { ORG_STATUS_STYLES as statusStyles } from '@/lib/status-styles';
import { UNIVERSITY_TYPE_LABELS as typeLabels } from '@/lib/organization-types';

function exportUniversities(rows) {
    if (!rows.length) return;
    const headers = ['Code', 'Name', 'Type', 'Campuses', 'Phone', 'Email', 'Status'];
    const body = rows.map((row) => {
        const u = row.original;
        return [u.code, u.name, typeLabels[u.type] || u.type, u.campus_count, u.phone, u.email, u.status];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-universities.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}

function UniversitiesDataTable({ data, onDelete, searchInput, onSearchChange }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
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
            cell: ({ row }) => <span className="text-muted-foreground">{typeLabels[row.original.type] || row.original.type || '-'}</span>,
        },
        {
            accessorKey: 'campus_count',
            header: ({ column }) => <SortButton column={column}>Campuses</SortButton>,
            cell: ({ row }) => (
                <span className="inline-flex items-center gap-1">
                    <Building2 className="size-3.5 text-muted-foreground"/>
                    {row.original.campus_count || 0}
                </span>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => row.original.email || '-',
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
                <Link to={`/universities/${row.original.id}/edit`}>
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
        state: { sorting, globalFilter },
        initialState: { pagination: { pageSize: 10 } },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return (<div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
          <Input className="pl-9" placeholder="Search universities..." value={searchInput} onChange={(e) => onSearchChange(e.target.value)}/>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => exportUniversities(table.getFilteredRowModel().rows)}>
            <Download />
            Export
          </Button>
          <Button asChild>
            <Link to="/universities/add">
              <Plus />
              Add University
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
                  <EmptyState title="No universities found" description="Create a university to get started." actionLabel="Add University" actionTo="/universities/add"/>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} universities
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

export function UniversitiesList() {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const searchTimer = useRef(null);

    const filtered = useMemo(() => {
        return universities.filter((u) => {
            if (typeFilter && u.type !== typeFilter) return false;
            if (statusFilter && u.status !== statusFilter) return false;
            return true;
        });
    }, [universities, typeFilter, statusFilter]);

    const totalCampuses = useMemo(() => universities.reduce((sum, u) => sum + (u.campus_count || 0), 0), [universities]);
    const activeCount = useMemo(() => universities.filter((u) => u.status === 'ACTIVE').length, [universities]);

    const handleSearchChange = useCallback((value) => {
        setSearchInput(value);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => setSearchFilter(value), 300);
    }, []);

    useEffect(() => {
        return () => {
            if (searchTimer.current) clearTimeout(searchTimer.current);
        };
    }, []);

    const fetchUniversities = useCallback(() => {
        setLoading(true);
        setError('');
        const params = {};
        if (typeFilter) params.type = typeFilter;
        if (statusFilter) params.status = statusFilter;
        if (searchFilter) params.search = searchFilter;
        getUniversities(params)
            .then((data) => {
            setUniversities(Array.isArray(data) ? data : []);
        })
            .catch((err) => setError(err.message || 'Failed to load universities.'))
            .finally(() => setLoading(false));
    }, [typeFilter, statusFilter, searchFilter]);
    useEffect(() => {
        fetchUniversities();
    }, [fetchUniversities]);
    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteUniversity(deleteTarget.id);
            toast.success('University deleted successfully.');
            setUniversities((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        }
        catch (err) {
            toast.error(err.message || 'Failed to delete university.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }, [deleteTarget]);
    return (<div className="space-y-6">
      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete University"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Universities</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${universities.length} universit${universities.length !== 1 ? 'ies' : 'y'} registered`}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <GraduationCap className="size-5"/>
        </span>
      </div>

      {!loading && universities.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard label="Total Universities" value={universities.length} icon={GraduationCap} />
          <StatsCard label="Active Universities" value={activeCount} icon={Building2} />
          <StatsCard label="Total Campuses" value={totalCampuses} icon={Building2} />
        </div>
      )}

      {error && <ErrorAlert message={error} onRetry={fetchUniversities} />}

      <Card>
        <CardHeader>
          <CardTitle>University Directory</CardTitle>
          <CardDescription>Search, filter, paginate, export, and manage university records.</CardDescription>
          <div className="flex flex-wrap gap-2 pt-2">
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
            <TableSkeleton />
          ) : (
            <UniversitiesDataTable data={filtered} onDelete={handleDelete} searchInput={searchInput} onSearchChange={handleSearchChange}/>
          )}
        </CardContent>
      </Card>
    </div>);
}
