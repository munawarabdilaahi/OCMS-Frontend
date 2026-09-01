/* eslint-disable react-hooks/incompatible-library */
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { cn } from '@/lib/cn';
import { SortButton } from '@/components/ui/data-table';
import { STUDENT_STATUS_STYLES as statusStyles } from '@/lib/status-styles';
function exportStudents(rows) {
    if (!rows.length) return;
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Gender', 'Department', 'Status'];
    const body = rows.map((row) => {
        const s = row.original;
        return [s.id, s.name, s.email, s.phone, s.gender, s.department, s.status];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-students.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}
export function StudentsDataTable({ data, onDelete, canManage = true }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: ({ column }) => <SortButton column={column}>ID</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => <SortButton column={column}>Full Name</SortButton>,
        },
        {
            accessorKey: 'email',
            header: ({ column }) => <SortButton column={column}>Email</SortButton>,
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
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
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (<Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status}</Badge>),
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
              {canManage && (<>
                <DropdownMenuItem asChild>
                  <Link to={`/students/${row.original.id}/edit`}>
                    <Pencil />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.original)}>
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </>)}
            </DropdownMenuContent>
          </DropdownMenu>),
        },
    ], [canManage, onDelete]);
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });
    return (<div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          <Select value={table.getColumn('department')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('department')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {[...new Set(data.map((s) => typeof s.department === 'object' ? s.department?.name : s.department).filter(Boolean))].map((dept) => (<SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={table.getColumn('status')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {[...new Set(data.map((s) => s.status).filter(Boolean))].map((status) => (<SelectItem key={status} value={status}>
                  {status}
                </SelectItem>))}
            </SelectContent>
          </Select>
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
                  <EmptyState title="No students found" description="Adjust your filters or add a new student record." actionLabel={canManage ? 'Add Student' : undefined} actionTo={canManage ? '/students/add' : undefined}/>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

    </div>);
}
