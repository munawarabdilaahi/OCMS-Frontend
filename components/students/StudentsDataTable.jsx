/* eslint-disable react-hooks/incompatible-library */
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, Download, Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { cn } from '@/lib/cn';
import { departments, getStudentFullName, studentStatuses } from '@/features/students/students-data';
const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Graduated: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    Suspended: 'bg-destructive/10 text-destructive',
};
function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}
function exportStudents(rows) {
    const headers = ['Student ID', 'Full Name', 'Email', 'Gender', 'Department', 'Program', 'Status', 'Enrollment Date'];
    const body = rows.map((row) => {
        const student = row.original;
        return [
            student.id,
            getStudentFullName(student),
            student.email,
            student.gender,
            student.department,
            student.program,
            student.status,
            student.enrollmentDate,
        ];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-students.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}
export function StudentsDataTable({ data, onDelete }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: ({ column }) => <SortButton column={column}>Student ID</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
        },
        {
            id: 'fullName',
            accessorFn: (row) => getStudentFullName(row),
            header: ({ column }) => <SortButton column={column}>Full Name</SortButton>,
        },
        {
            accessorKey: 'email',
            header: ({ column }) => <SortButton column={column}>Email</SortButton>,
        },
        {
            accessorKey: 'gender',
            header: 'Gender',
        },
        {
            accessorKey: 'department',
            header: ({ column }) => <SortButton column={column}>Department</SortButton>,
        },
        {
            accessorKey: 'program',
            header: 'Program',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (<Badge className={cn('whitespace-nowrap', statusStyles[row.original.status])}>{row.original.status}</Badge>),
        },
        {
            accessorKey: 'enrollmentDate',
            header: ({ column }) => <SortButton column={column}>Enrollment Date</SortButton>,
        },
        {
            id: 'actions',
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
                <Link to={`/students/${row.original.id}`}>
                  <Eye />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/students/${row.original.id}/edit`}>
                  <Pencil />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.original.id)}>
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
        <div className="grid gap-3 sm:grid-cols-[minmax(0,320px)_180px_160px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
            <Input className="pl-9" placeholder="Search students..." value={globalFilter ?? ''} onChange={(event) => setGlobalFilter(event.target.value)}/>
          </div>
          <Select value={table.getColumn('department')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('department')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Department"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((department) => (<SelectItem key={department} value={department}>
                  {department}
                </SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={table.getColumn('status')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {studentStatuses.map((status) => (<SelectItem key={status} value={status}>
                  {status}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => exportStudents(table.getFilteredRowModel().rows)}>
            <Download />
            Export
          </Button>
          <Button asChild>
            <Link to="/students/add">
              <Plus />
              Add Student
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
                  <EmptyState title="No students found" description="Adjust your filters or add a new student record." actionLabel="Add Student" actionTo="/students/add"/>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} students
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
