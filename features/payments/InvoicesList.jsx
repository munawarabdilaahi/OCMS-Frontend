import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowLeft, ArrowUpDown, Download, Eye, MoreHorizontal, Search } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect } from 'react';
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
import { formatCurrency, formatDate, paymentStatuses } from '@/features/payments/PaymentsList';
import { getInvoices, getInvoiceStats } from '@/services/payments.service';

const invoiceStatuses = ['Pending', 'Partial', 'Paid', 'Overdue'];
const statusStyles = {
    Paid: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Partial: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
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
    const headers = ['Invoice Number', 'Student', 'Fee', 'Amount', 'Paid', 'Balance', 'Status', 'Due Date'];
    const body = rows.map((row) => {
        const inv = row.original;
        return [inv.invoice_number, inv.student, inv.fee_name, inv.amount, inv.paid_amount, inv.balance, inv.status, inv.due_date];
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
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ total_invoiced: 0, outstanding_balance: 0, open_invoices: 0 });
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState([]);

    const fetchData = useCallback(() => {
        setLoading(true);
        Promise.all([getInvoices(), getInvoiceStats()])
            .then(([invoiceData, statsData]) => {
                setInvoices(Array.isArray(invoiceData?.data) ? invoiceData.data : []);
                if (statsData) setStats(statsData);
            })
            .catch(() => setError('Failed to load invoices.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const columns = useMemo(() => [
        {
            accessorKey: 'invoice_number',
            header: ({ column }) => <SortButton column={column}>Invoice #</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.invoice_number}</span>,
        },
        {
            accessorKey: 'student',
            header: ({ column }) => <SortButton column={column}>Student</SortButton>,
            cell: ({ row }) => (<div>
            <p className="font-medium">{row.original.student}</p>
            <p className="text-xs text-muted-foreground">{row.original.admission_no}</p>
          </div>),
        },
        {
            accessorKey: 'fee_name',
            header: 'Fee',
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => <SortButton column={column}>Amount</SortButton>,
            cell: ({ row }) => formatCurrency(row.original.amount),
        },
        {
            accessorKey: 'paid_amount',
            header: ({ column }) => <SortButton column={column}>Paid</SortButton>,
            cell: ({ row }) => formatCurrency(row.original.paid_amount),
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
            accessorKey: 'due_date',
            header: ({ column }) => <SortButton column={column}>Due Date</SortButton>,
            cell: ({ row }) => formatDate(row.original.due_date),
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
                <Link to={`/payments/${row.original.invoice_number}`}>
                  <Eye />
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>),
        },
    ], []);

    const table = useReactTable({
        data: invoices,
        columns,
        state: { sorting, globalFilter, columnFilters },
        initialState: { pagination: { pageSize: 8 } },
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
          <CardHeader><CardTitle className="text-base">Total Invoiced</CardTitle><CardDescription>All issued invoices</CardDescription></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{formatCurrency(stats.total_invoiced)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Outstanding Balance</CardTitle><CardDescription>Pending, overdue, and partial invoices</CardDescription></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{formatCurrency(stats.outstanding_balance)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Open Invoices</CardTitle><CardDescription>Invoices not fully paid</CardDescription></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{stats.open_invoices}</p></CardContent>
        </Card>
      </div>

      {error && (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}

      <Card>
        <CardHeader>
          <CardTitle>Invoice Register</CardTitle>
          <CardDescription>Search, filter, export, and inspect all finance invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,320px)_170px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                  <Input className="pl-9" placeholder="Search invoices..." value={globalFilter ?? ''} onChange={(event) => setGlobalFilter(event.target.value)}/>
                </div>
                <Select value={table.getColumn('status')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)}>
                  <SelectTrigger><SelectValue placeholder="Status"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {invoiceStatuses.map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="outline" onClick={() => exportInvoices(table.getFilteredRowModel().rows)}>
                <Download /> Export
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
                        {row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}
                      </TableRow>))) : (<TableRow>
                      <TableCell colSpan={columns.length} className="p-6">
                        <EmptyState title="No invoices found" description="Invoices will appear once they are created in the system."/>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} invoices</p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
              </div>
            </div>
          </div>)}
        </CardContent>
      </Card>
    </div>);
}
