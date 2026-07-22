import { ArrowUpDown, Download, Eye, FileText, MoreHorizontal, Search } from 'lucide-react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { ROLES } from '@/lib/roles';
import { getPayments, getPaymentStats } from '@/services/payments.service';

export const paymentStatuses = ['Completed', 'Pending', 'Failed'];
export const paymentMethods = ['Bank Transfer', 'Mobile Money', 'Card', 'Cash', 'Scholarship'];
const statusStyles = {
    Completed: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Failed: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
};
export function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}
export function formatDate(value) {
    if (!value) return '-';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}
function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}
function exportPayments(rows) {
    if (!rows.length) return;
    const headers = ['Invoice Number', 'Student', 'Amount', 'Payment Method', 'Status', 'Date'];
    const body = rows.map((row) => {
        const p = row.original;
        return [p.invoice_number, p.student, p.amount, p.payment_method, p.status, p.created_at];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-payments.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}
function PaymentsDataTable({ data, isStudent = false }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'invoice_number',
            header: ({ column }) => <SortButton column={column}>Invoice #</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.invoice_number}</span>,
        },
        {
            accessorKey: 'student',
            header: ({ column }) => <SortButton column={column}>Student</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.student}</span>,
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => <SortButton column={column}>Amount</SortButton>,
            cell: ({ row }) => formatCurrency(row.original.amount),
        },
        {
            accessorKey: 'payment_method',
            header: 'Method',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (<Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status}</Badge>),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => <SortButton column={column}>Date</SortButton>,
            cell: ({ row }) => formatDate(row.original.created_at),
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
        data,
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
    return (<div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,320px)_170px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
            <Input className="pl-9" placeholder="Search payments..." value={globalFilter ?? ''} onChange={(event) => setGlobalFilter(event.target.value)}/>
          </div>
          <Select value={table.getColumn('status')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {paymentStatuses.map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={table.getColumn('payment_method')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('payment_method')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Method"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              {paymentMethods.map((method) => (<SelectItem key={method} value={method}>{method}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => exportPayments(table.getFilteredRowModel().rows)}>
            <Download />
            Export
          </Button>
          {!isStudent && (<Button asChild>
              <Link to="/payments/invoices">
                <FileText />
                Invoices
              </Link>
            </Button>)}
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
                  <EmptyState title="No payments found" description="Payments will appear once invoices are created and processed." actionLabel={isStudent ? undefined : 'Open Invoices'} actionTo={isStudent ? undefined : '/payments/invoices'}/>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} payments
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
        </div>
      </div>
    </div>);
}
export function PaymentsList() {
    const { user } = useAuth();
    const isStudent = user?.role === ROLES.STUDENT;
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ total_received: 0, this_month: 0, completed_count: 0, pending_count: 0 });

    const fetchData = useCallback(() => {
        setLoading(true);
        const params = isStudent ? { student_id: user?.student_id } : {};
        Promise.all([getPayments(params), getPaymentStats(params)])
            .then(([paymentData, statsData]) => {
                setPayments(Array.isArray(paymentData?.data) ? paymentData.data : []);
                if (statsData) setStats(statsData);
            })
            .catch(() => setError('Failed to load payment data.'))
            .finally(() => setLoading(false));
    }, [isStudent, user?.student_id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {isStudent ? 'My Payments' : 'Payments & Finance'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isStudent ? 'Review your own invoices, balances, and payment status.' : 'Track revenue, invoice status, payment methods, and collection performance.'}
          </p>
        </div>
        {!isStudent && (<Button asChild>
            <Link to="/payments/invoices">
              Manage Invoices
            </Link>
          </Button>)}
      </div>

      {!isStudent && (<div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Total Received</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{formatCurrency(stats.total_received)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">This Month</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{formatCurrency(stats.this_month)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Completed</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{stats.completed_count}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Pending</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{stats.pending_count}</p></CardContent>
        </Card>
      </div>)}

      {error && (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}

      <Card>
        <CardHeader>
          <CardTitle>{isStudent ? 'My Payment Records' : 'Payment Records'}</CardTitle>
          <CardDescription>{isStudent ? 'Search and review your own payment activity.' : 'Search, filter, export, and review student payment activity.'}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : <PaymentsDataTable data={payments} isStudent={isStudent}/>}
        </CardContent>
      </Card>
    </div>);
}
