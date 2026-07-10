/* eslint-disable react-hooks/incompatible-library, react-refresh/only-export-components */
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, Building2, Download, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { EmptyState } from '@/components/common/EmptyState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { cn } from '@/lib/cn';
export const departmentStatuses = ['Active', 'Inactive', 'Archived'];
export const headOfDepartmentOptions = [
    'Dr. Sarah Johnson',
    'Michael Chen',
    'Dr. Emily Brown',
    'James Wilson',
    'Dr. Grace Kimani',
    'Prof. Amina Hassan',
];
export const defaultDepartments = [
    {
        code: 'CS',
        name: 'Computer Science',
        description: 'Software engineering, data systems, networking, and computing programs.',
        headOfDepartment: 'Dr. Sarah Johnson',
        totalTeachers: 18,
        totalStudents: 420,
        status: 'Active',
    },
    {
        code: 'BUS',
        name: 'Business',
        description: 'Accounting, management, finance, entrepreneurship, and business administration.',
        headOfDepartment: 'Michael Chen',
        totalTeachers: 14,
        totalStudents: 365,
        status: 'Active',
    },
    {
        code: 'ENG',
        name: 'Engineering',
        description: 'Civil, electrical, mechanical, and applied engineering courses.',
        headOfDepartment: 'James Wilson',
        totalTeachers: 22,
        totalStudents: 510,
        status: 'Active',
    },
    {
        code: 'HS',
        name: 'Health Sciences',
        description: 'Nursing, public health, clinical sciences, and allied health programs.',
        headOfDepartment: 'Dr. Grace Kimani',
        totalTeachers: 16,
        totalStudents: 288,
        status: 'Active',
    },
    {
        code: 'EDU',
        name: 'Education',
        description: 'Teacher training, curriculum studies, and educational leadership.',
        headOfDepartment: 'Prof. Amina Hassan',
        totalTeachers: 11,
        totalStudents: 240,
        status: 'Inactive',
    },
    {
        code: 'PHY',
        name: 'Physics',
        description: 'General physics, theoretical physics, laboratory science, and research courses.',
        headOfDepartment: 'Dr. Emily Brown',
        totalTeachers: 9,
        totalStudents: 132,
        status: 'Archived',
    },
];
const storageKey = 'ocms-departments';
const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Inactive: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Archived: 'bg-muted text-muted-foreground',
};
function readStoredDepartments() {
    if (typeof window === 'undefined') {
        return defaultDepartments;
    }
    try {
        const storedDepartments = window.localStorage.getItem(storageKey);
        return storedDepartments ? JSON.parse(storedDepartments) : defaultDepartments;
    }
    catch {
        return defaultDepartments;
    }
}
export function getDepartments() {
    return readStoredDepartments();
}
export function getDepartmentByCode(code) {
    return getDepartments().find((department) => department.code === code);
}
export function saveDepartment(department) {
    const departments = getDepartments();
    const nextDepartments = departments.some((item) => item.code === department.code)
        ? departments.map((item) => (item.code === department.code ? { ...item, ...department } : item))
        : [{ totalTeachers: 0, totalStudents: 0, ...department }, ...departments];
    window.localStorage.setItem(storageKey, JSON.stringify(nextDepartments));
    return nextDepartments;
}
export function deleteDepartment(code) {
    const nextDepartments = getDepartments().filter((department) => department.code !== code);
    window.localStorage.setItem(storageKey, JSON.stringify(nextDepartments));
    return nextDepartments;
}
function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}
function exportDepartments(rows) {
    const headers = [
        'Department Code',
        'Department Name',
        'Head of Department',
        'Total Teachers',
        'Total Students',
        'Status',
    ];
    const body = rows.map((row) => {
        const department = row.original;
        return [
            department.code,
            department.name,
            department.headOfDepartment,
            department.totalTeachers,
            department.totalStudents,
            department.status,
        ];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
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
    const [columnFilters, setColumnFilters] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'code',
            header: ({ column }) => <SortButton column={column}>Department Code</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.code}</span>,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => <SortButton column={column}>Department Name</SortButton>,
        },
        {
            accessorKey: 'headOfDepartment',
            header: ({ column }) => <SortButton column={column}>Head of Department</SortButton>,
        },
        {
            accessorKey: 'totalTeachers',
            header: ({ column }) => <SortButton column={column}>Total Teachers</SortButton>,
            cell: ({ row }) => <span>{row.original.totalTeachers.toLocaleString()}</span>,
        },
        {
            accessorKey: 'totalStudents',
            header: ({ column }) => <SortButton column={column}>Total Students</SortButton>,
            cell: ({ row }) => <span>{row.original.totalStudents.toLocaleString()}</span>,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (<Badge className={cn('whitespace-nowrap', statusStyles[row.original.status])}>{row.original.status}</Badge>),
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
                <Link to={`/departments/${row.original.code}/edit`}>
                  <Pencil />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.original.code)}>
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
        state: {
            sorting,
            globalFilter,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return (<div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,320px)_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
            <Input className="pl-9" placeholder="Search departments..." value={globalFilter ?? ''} onChange={(event) => setGlobalFilter(event.target.value)}/>
          </div>
          <Select value={table.getColumn('status')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {departmentStatuses.map((status) => (<SelectItem key={status} value={status}>
                  {status}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => exportDepartments(table.getFilteredRowModel().rows)}>
            <Download />
            Export
          </Button>
          <Button asChild>
            <Link to="/departments/add">
              <Plus />
              Add Department
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
                  <EmptyState title="No departments found" description="Adjust your filters or add a new department." actionLabel="Add Department" actionTo="/departments/add"/>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} departments
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
export function DepartmentsList() {
    const [departments, setDepartments] = useState(() => getDepartments());
    const [deletedCode, setDeletedCode] = useState('');
    const handleDelete = useCallback((code) => {
        const confirmed = window.confirm(`Delete department ${code}? This only updates mock frontend data.`);
        if (!confirmed) {
            return;
        }
        setDepartments(deleteDepartment(code));
        setDeletedCode(code);
    }, []);
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Departments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage academic departments, department heads, staffing, enrollment, and operating status.
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Building2 className="size-5"/>
        </span>
      </div>

      {deletedCode && (<Alert>
          <AlertTitle>Department removed</AlertTitle>
          <AlertDescription>{deletedCode} was removed from the mock table data.</AlertDescription>
        </Alert>)}

      <Card>
        <CardHeader>
          <CardTitle>Department Directory</CardTitle>
          <CardDescription>Search, filter, paginate, export, and manage department records.</CardDescription>
        </CardHeader>
        <CardContent>
          <DepartmentsDataTable data={departments} onDelete={handleDelete}/>
        </CardContent>
      </Card>
    </div>);
}
