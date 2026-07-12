import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowLeft, ArrowUpDown, Download, Eye, MoreHorizontal, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link } from '@/lib/router';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { cn } from '@/lib/cn';
import { formatCurrency, formatDate, paymentStatuses } from '@/features/payments/PaymentsList';
const statusStyles = {
    Paid: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Overdue: 'bg-destructive/10 text-destructive',
    Failed: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
};
function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}
function exportInvoices(rows) {
    if (!rows.length) return;
    const headers = ['Invoice Number', 'Student', 'Program', 'Amount', 'Balance', 'Status', 'Due Date'];
    const body = rows.map((row) => {
        const invoice = row.original;
        return [
            invoice.invoiceNumber,
            invoice.student,
            invoice.program,
            invoice.amount,
            invoice.balance,
            invoice.status,
            invoice.dueDate,
        ];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-invoices.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}
export function InvoicesList() {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState([]);
    const data = [];
    const columns = useMemo(() => [
        {
            accessorKey: 'invoiceNumber',
            header: ({ column }) => <SortButton column={column}>Invoice Number</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.invoiceNumber}</span>,
        },
        {
            accessorKey: 'student',
            header: ({ column }) => <SortButton column={column}>Student</SortButton>,
            cell: ({ row }) => (<div>
            <p className="font-medium">{row.original.student}</p>
            <p className="text-xs text-muted-foreground">{row.original.studentId}</p>
          </div>),
        },
        {
            accessorKey: 'program',
            header: 'Program',
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => <SortButton column={column}>Amount</SortButton>,
            cell: ({ row }) => formatCurrency(row.original.amount),
        },
        {
            accessorKey: 'balance',
            header: ({ column }) => <SortButton column={column}>Balance</SortButton>,
            cell: ({ row }) => formatCurrency(row.original.balance),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (<Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status}</Badge>),
        },
        {
            accessorKey: 'dueDate',
            header: ({ column }) => <SortButton column={column}>Due Date</SortButton>,
            cell: ({ row }) => formatDate(row.original.dueDate),
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
                <Link to={`/payments/${row.original.invoiceNumber}`}>
                  <Eye />
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>),
        },
    ], []);
    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter, columnFilters },
        initialState: { pagination: { pageSize: 6 } },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Button asChild type="button" variant="ghost" className="-ml-3 w-fit">
            <Link to="/payments">
              <ArrowLeft />
              Back to payments
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Invoices</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review issued invoices, outstanding balances, and student billing status.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Invoiced</CardTitle>
            <CardDescription>All issued invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Outstanding Balance</CardTitle>
            <CardDescription>Pending, overdue, and failed invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Open Invoices</CardTitle>
            <CardDescription>Invoices not fully paid</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Register</CardTitle>
          <CardDescription>Search, filter, export, and inspect all finance invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,320px)_170px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                  <Input className="pl-9" placeholder="Search invoices..." value={globalFilter ?? ''} onChange={(event) => setGlobalFilter(event.target.value)}/>
                </div>
                <Select value={table.getColumn('status')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {paymentStatuses.map((status) => (<SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="button" variant="outline" onClick={() => exportInvoices(table.getFilteredRowModel().rows)}>
                <Download />
                Export
              </Button>
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
                        <EmptyState title="No invoices found" description="Invoices will appear once they are created in the system."/>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} invoices
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
          </div>
        </CardContent>
      </Card>
    </div>);
}
