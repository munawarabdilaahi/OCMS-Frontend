import { ArrowUpDown, Download, Eye, FileText, MoreHorizontal, Search } from 'lucide-react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { EmptyState } from '@/components/common/EmptyState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { ROLES } from '@/lib/roles';
import { formatCurrency } from '@/features/payments/payment-constants';
import { getPayments, getPaymentStats } from '@/services/payments.service';
import { SortButton } from '@/components/ui/data-table';

export { formatCurrency } from '@/features/payments/payment-constants';

const statusStyles = {
    COMPLETED: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    PENDING: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    FAILED: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
    REFUNDED: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
};

export function PaymentsList() {
    const { user, can } = useAuth();
    const isStudent = user?.role === ROLES.STUDENT;
    const canManage = can('payments:manage');
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ total_received: 0, this_month: 0, completed_count: 0, pending_count: 0 });
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sorting, setSorting] = useState([]);
    const pageSize = 10;

    const fetchData = useCallback(() => {
        setLoading(true);
        const params = { page, pageSize };
        if (isStudent) params.student_id = user?.studentId;
        if (search.trim()) params.search = search.trim();
        if (statusFilter) params.status = statusFilter;
        Promise.all([getPayments(params), getPaymentStats(isStudent ? { student_id: user?.studentId } : {})])
            .then(([paymentData, statsData]) => {
                setPayments(Array.isArray(paymentData?.data) ? paymentData.data : []);
                setTotalCount(paymentData?.meta?.total ?? paymentData?.data?.length ?? 0);
                if (statsData) setStats(statsData);
            })
            .catch(() => setError('Failed to load payment data.'))
            .finally(() => setLoading(false));
    }, [isStudent, user?.studentId, search, statusFilter, page]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const columns = useMemo(() => [
        { accessorKey: 'invoice_number', header: ({ column }) => <SortButton column={column}>Invoice #</SortButton>, cell: ({ row }) => <span className="font-medium">{row.original.invoice_number}</span> },
        { accessorKey: 'student', header: ({ column }) => <SortButton column={column}>Student</SortButton>, cell: ({ row }) => <span className="font-medium">{row.original.student}</span> },
        { accessorKey: 'amount', header: ({ column }) => <SortButton column={column}>Amount</SortButton>, cell: ({ row }) => formatCurrency(row.original.amount) },
        { accessorKey: 'payment_method', header: 'Method' },
        { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status}</Badge> },
        { accessorKey: 'created_at', header: ({ column }) => <SortButton column={column}>Date</SortButton>, cell: ({ row }) => row.original.created_at ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(row.original.created_at)) : '-' },
        { id: 'actions', enableHiding: false, cell: ({ row }) => (<DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="ghost" size="icon"><MoreHorizontal /><span className="sr-only">Open row actions</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link to={`/payments/${row.original.invoice_number}`}><Eye />View Details</Link></DropdownMenuItem></DropdownMenuContent></DropdownMenu>) },
    ], []);

    const table = useReactTable({ data: payments, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });
    const pageCount = Math.ceil(totalCount / pageSize);

    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">{isStudent ? 'My Payments' : 'Payments & Finance'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{isStudent ? 'Review your own invoices, balances, and payment status.' : 'Track revenue, invoice status, payment methods, and collection performance.'}</p>
        </div>
        {canManage && (<Button asChild><Link to="/payments/invoices"><FileText />Manage Invoices</Link></Button>)}
      </div>
      {!isStudent && (<div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base">Total Received</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{formatCurrency(stats.total_received)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base">This Month</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{formatCurrency(stats.this_month)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base">Completed</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{stats.completed_count}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base">Pending</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{stats.pending_count}</p></CardContent></Card>
      </div>)}
      {error && (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}
      <Card>
        <CardHeader>
          <CardTitle>{isStudent ? 'My Payment Records' : 'Payment Records'}</CardTitle>
          <CardDescription>{isStudent ? 'Search and review your own payment activity.' : 'Search, filter, and review student payment activity.'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
              <Input className="pl-9" placeholder="Search payments..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}/>
            </div>
            <Select value={statusFilter || 'all'} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : (<div className="space-y-4">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>{table.getHeaderGroups().map((hg) => (<TableRow key={hg.id}>{hg.headers.map((h) => (<TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}</TableRow>))}</TableHeader>
                <TableBody>{table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => (<TableRow key={row.id}>{row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}</TableRow>)) : (<TableRow><TableCell colSpan={columns.length} className="p-6"><EmptyState title="No payments found" description="Payments will appear once invoices are created and processed." actionLabel={canManage ? 'Open Invoices' : undefined} actionTo={canManage ? '/payments/invoices' : undefined}/></TableCell></TableRow>)}</TableBody>
              </Table>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalCount)} of {totalCount} payments</p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {page} of {pageCount || 1}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount}>Next</Button>
              </div>
            </div>
          </div>)}
        </CardContent>
      </Card>
    </div>);
}
