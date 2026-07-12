import { useState, useCallback } from 'react';
import { Link } from '@/lib/router';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table";
import { MoreHorizontal, Search, FileDown, Filter, ArrowUpDown, Pencil, Trash2, Eye, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/cn';
const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    'On Leave': 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Contract: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    Inactive: 'bg-destructive/10 text-destructive',
    Retired: 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
};
export function TeachersDataTable({ data, onDelete }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const columns = [
        {
            accessorKey: "id",
            header: "Employee ID",
        },
        {
            accessorKey: "fullName",
            header: ({ column }) => (<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>),
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "department",
            header: "Department",
        },
        {
            accessorKey: "position",
            header: "Position",
        },
        {
            accessorKey: "employmentDate",
            header: "Employment Date",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status");
                return (<Badge className={cn(statusStyles[status] || '')}>
            {status}
          </Badge>);
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to={`/teachers/${row.original.id}/view`}>
                <Eye className="mr-2 h-4 w-4"/> View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/teachers/${row.original.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4"/> Edit Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(row.original.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4"/> Delete Teacher
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>),
        },
    ];
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });
    const exportData = useCallback(() => {
        if (!data.length) return;
        const headers = [
            "Employee ID",
            "Full Name",
            "Email",
            "Department",
            "Position",
            "Employment Date",
            "Status",
        ];
        const csvContent = [
            headers.join(","),
            ...data.map((t) => [t.id, t.fullName, t.email, t.department, t.position, t.employmentDate, t.status].join(",")),
        ].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "teachers_list.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [data]);
    return (<div className="space-y-4">
      <div className="flex items-center py-4 gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
          <Input placeholder="Search teachers..." value={globalFilter ?? ""} onChange={(event) => setGlobalFilter(event.target.value)} className="pl-8"/>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4"/> Filter Department
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => table.getColumn("department")?.setFilterValue("")}>All</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" onClick={exportData}>
          <FileDown className="mr-2 h-4 w-4"/> Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (<TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (<TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>))}
              </TableRow>))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => (<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>))}
                </TableRow>))) : (<TableRow>
                <TableCell colSpan={columns.length} className="p-6">
                  <EmptyState title="No teachers found" description="Teacher records will be available once the backend is connected."/>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>);
}
