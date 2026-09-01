import { useState, useCallback, useMemo } from 'react';
import { Link } from '@/lib/router';
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Eye, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from '@/components/common/EmptyState';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/cn';
import { SortButton } from '@/components/ui/data-table';

import { TEACHER_STATUS_STYLES as statusStyles } from '@/lib/status-styles';

export function TeachersDataTable({ data, onDelete }) {
    const [sorting, setSorting] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: "id",
            header: ({ column }) => <SortButton column={column}>ID</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
        },
        {
            accessorKey: "name",
            header: ({ column }) => <SortButton column={column}>Full Name</SortButton>,
        },
        {
            accessorKey: "email",
            header: ({ column }) => <SortButton column={column}>Email</SortButton>,
        },
        {
            accessorKey: "department",
            header: ({ column }) => <SortButton column={column}>Department</SortButton>,
        },
        {
            accessorKey: "position",
            header: "Position",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status}</Badge>,
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/teachers/${row.original.id}`}>
                <Eye className="mr-2 h-4 w-4"/> View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/teachers/${row.original.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4"/> Edit Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.original)}>
              <Trash2 className="mr-2 h-4 w-4"/> Delete Teacher
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>),
        },
    ], [onDelete]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
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
              {[...new Set(data.map((t) => t.department).filter(Boolean))].map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={table.getColumn('status')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {[...new Set(data.map((t) => t.status).filter(Boolean))].map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
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
                  {row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>))}
                </TableRow>))) : (<TableRow>
                <TableCell colSpan={columns.length} className="p-6">
                  <EmptyState title="No teachers found" description="Teacher records will appear once they are added." actionLabel="Add Teacher" actionTo="/teachers/add"/>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

    </div>);
}
