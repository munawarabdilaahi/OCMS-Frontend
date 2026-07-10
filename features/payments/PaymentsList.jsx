/* eslint-disable react-hooks/incompatible-library, react-refresh/only-export-components */
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from 'recharts';
import { ArrowUpDown, Banknote, CheckCircle2, CreditCard, Download, Eye, FileText, MoreHorizontal, Plus, Search, TrendingUp, } from 'lucide-react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { EmptyState } from '@/components/common/EmptyState';
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
export const paymentStatuses = ['Paid', 'Pending', 'Overdue', 'Failed'];
export const paymentMethods = ['Bank Transfer', 'Mobile Money', 'Card', 'Cash', 'Scholarship'];
export const invoices = [
    {
        invoiceNumber: 'INV-2026-001',
        studentId: 'STU-2026-001',
        student: 'Amina Hassan',
        program: 'Computer Science',
        amount: 1280,
        balance: 0,
        paymentMethod: 'Bank Transfer',
        status: 'Paid',
        date: '2026-06-02',
        dueDate: '2026-06-10',
        term: 'Term 2',
        description: 'Tuition fee installment',
    },
    {
        invoiceNumber: 'INV-2026-002',
        studentId: 'STU-2026-027',
        student: 'Brian Otieno',
        program: 'Business Administration',
        amount: 940,
        balance: 940,
        paymentMethod: 'Mobile Money',
        status: 'Pending',
        date: '2026-06-03',
        dueDate: '2026-06-18',
        term: 'Term 2',
        description: 'Tuition and library fees',
    },
    {
        invoiceNumber: 'INV-2026-003',
        studentId: 'STU-2026-038',
        student: 'Chantal Niyonsaba',
        program: 'Information Systems',
        amount: 1160,
        balance: 0,
        paymentMethod: 'Card',
        status: 'Paid',
        date: '2026-06-05',
        dueDate: '2026-06-15',
        term: 'Term 2',
        description: 'Tuition fee installment',
    },
    {
        invoiceNumber: 'INV-2026-004',
        studentId: 'STU-2026-051',
        student: 'Daniel Mwangi',
        program: 'Software Engineering',
        amount: 1325,
        balance: 1325,
        paymentMethod: 'Bank Transfer',
        status: 'Overdue',
        date: '2026-05-28',
        dueDate: '2026-06-08',
        term: 'Term 2',
        description: 'Tuition and lab fees',
    },
    {
        invoiceNumber: 'INV-2026-005',
        studentId: 'STU-2026-063',
        student: 'Esther Wanjiku',
        program: 'Data Science',
        amount: 1490,
        balance: 0,
        paymentMethod: 'Scholarship',
        status: 'Paid',
        date: '2026-06-07',
        dueDate: '2026-06-16',
        term: 'Term 2',
        description: 'Sponsored tuition payment',
    },
    {
        invoiceNumber: 'INV-2026-006',
        studentId: 'STU-2026-074',
        student: 'Farah Mohamed',
        program: 'Cybersecurity',
        amount: 1210,
        balance: 1210,
        paymentMethod: 'Cash',
        status: 'Failed',
        date: '2026-06-08',
        dueDate: '2026-06-20',
        term: 'Term 2',
        description: 'Tuition fee installment',
    },
    {
        invoiceNumber: 'INV-2026-007',
        studentId: 'STU-2026-088',
        student: 'Grace Njeri',
        program: 'Accounting',
        amount: 875,
        balance: 0,
        paymentMethod: 'Mobile Money',
        status: 'Paid',
        date: '2026-06-10',
        dueDate: '2026-06-22',
        term: 'Term 2',
        description: 'Tuition and activity fees',
    },
    {
        invoiceNumber: 'INV-2026-008',
        studentId: 'STU-2026-096',
        student: 'Hassan Ali',
        program: 'Networking',
        amount: 1040,
        balance: 520,
        paymentMethod: 'Card',
        status: 'Pending',
        date: '2026-06-12',
        dueDate: '2026-06-24',
        term: 'Term 2',
        description: 'Partial tuition payment',
    },
];
export const monthlyRevenue = [
    { month: 'Jan', revenue: 14800 },
    { month: 'Feb', revenue: 17250 },
    { month: 'Mar', revenue: 18920 },
    { month: 'Apr', revenue: 20440 },
    { month: 'May', revenue: 22680 },
    { month: 'Jun', revenue: 25210 },
];
export const collectionTrend = [
    { month: 'Jan', rate: 72 },
    { month: 'Feb', rate: 76 },
    { month: 'Mar', rate: 81 },
    { month: 'Apr', rate: 84 },
    { month: 'May', rate: 86 },
    { month: 'Jun', rate: 89 },
];
const statusStyles = {
    Paid: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Overdue: 'bg-destructive/10 text-destructive',
    Failed: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
};
const cardToneClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    sky: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    teal: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
};
export function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}
export function formatDate(value) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(value));
}
export function getPaymentByInvoiceNumber(invoiceNumber) {
    return invoices.find((invoice) => invoice.invoiceNumber === invoiceNumber);
}
export function getPaymentsByStudentId(studentId) {
    return invoices.filter((invoice) => invoice.studentId === studentId);
}
function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}
function FinanceMetricCard({ title, value, description, icon: Icon, tone }) {
    return (<Card className="overflow-hidden">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal">{value}</p>
        </div>
        <span className={cn('flex size-10 items-center justify-center rounded-md', cardToneClasses[tone])}>
          <Icon className="size-5"/>
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>);
}
function ChartTooltip({ active, payload, label, formatter }) {
    if (!active || !payload?.length) {
        return null;
    }
    const item = payload[0];
    return (<div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      <p className="text-muted-foreground">
        {item.name}: <span className="font-medium text-foreground">{formatter(item.value)}</span>
      </p>
    </div>);
}
function RevenueChart() {
    return (<Card>
      <CardHeader>
        <CardTitle className="text-base">Monthly Revenue</CardTitle>
        <CardDescription>Collected revenue across the current academic term.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border))"/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={12} stroke="rgb(var(--muted-foreground))" fontSize={12}/>
              <YAxis axisLine={false} tickLine={false} tickMargin={10} width={44} stroke="rgb(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${Math.round(value / 1000)}k`}/>
              <Tooltip cursor={{ fill: 'rgb(var(--muted))', opacity: 0.55 }} content={<ChartTooltip formatter={formatCurrency}/>}/>
              <Bar dataKey="revenue" name="Revenue" fill="rgb(var(--primary))" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>);
}
function CollectionTrendChart() {
    return (<Card>
      <CardHeader>
        <CardTitle className="text-base">Collection Trend</CardTitle>
        <CardDescription>Payment collection rate over the last six months.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={collectionTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="collectionTrend" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="rgb(var(--accent))" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="rgb(var(--accent))" stopOpacity={0.03}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border))"/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={12} stroke="rgb(var(--muted-foreground))" fontSize={12}/>
              <YAxis axisLine={false} tickLine={false} tickMargin={10} width={42} stroke="rgb(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value}%`}/>
              <Tooltip cursor={{ stroke: 'rgb(var(--accent))', strokeOpacity: 0.2, strokeWidth: 2 }} content={<ChartTooltip formatter={(value) => `${value}%`}/>}/>
              <Area type="monotone" dataKey="rate" name="Collection Rate" stroke="rgb(var(--accent))" strokeWidth={2.5} fill="url(#collectionTrend)" activeDot={{ r: 5, fill: 'rgb(var(--accent))', stroke: 'rgb(var(--background))', strokeWidth: 2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>);
}
function exportPayments(rows) {
    const headers = ['Invoice Number', 'Student', 'Amount', 'Payment Method', 'Status', 'Date'];
    const body = rows.map((row) => {
        const payment = row.original;
        return [
            payment.invoiceNumber,
            payment.student,
            payment.amount,
            payment.paymentMethod,
            payment.status,
            payment.date,
        ];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
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
            accessorKey: 'amount',
            header: ({ column }) => <SortButton column={column}>Amount</SortButton>,
            cell: ({ row }) => formatCurrency(row.original.amount),
        },
        {
            accessorKey: 'paymentMethod',
            header: 'Payment Method',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (<Badge className={cn('whitespace-nowrap', statusStyles[row.original.status])}>{row.original.status}</Badge>),
        },
        {
            accessorKey: 'date',
            header: ({ column }) => <SortButton column={column}>Date</SortButton>,
            cell: ({ row }) => formatDate(row.original.date),
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
              {!isStudent && (<DropdownMenuItem asChild>
                  <Link to="/payments/invoices">
                    <FileText />
                    Open Invoices
                  </Link>
                </DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>),
        },
    ], [isStudent]);
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
              {paymentStatuses.map((status) => (<SelectItem key={status} value={status}>
                  {status}
                </SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={table.getColumn('paymentMethod')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('paymentMethod')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Method"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              {paymentMethods.map((method) => (<SelectItem key={method} value={method}>
                  {method}
                </SelectItem>))}
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
                  <EmptyState title="No payments found" description="Adjust your filters or open invoices to create a payment record." actionLabel={isStudent ? undefined : 'Open Invoices'} actionTo={isStudent ? undefined : '/payments/invoices'}/>
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
export function PaymentsList() {
    const { user } = useAuth();
    const isStudent = user?.role === ROLES.STUDENT;
    const visibleInvoices = isStudent ? getPaymentsByStudentId(user.studentId) : invoices;
    const paidInvoices = visibleInvoices.filter((invoice) => invoice.status === 'Paid');
    const pendingInvoices = visibleInvoices.filter((invoice) => invoice.status !== 'Paid');
    const totalRevenue = paidInvoices.reduce((total, invoice) => total + invoice.amount, 0);
    const pendingPayments = pendingInvoices.reduce((total, invoice) => total + invoice.balance, 0);
    const collectionRate = visibleInvoices.length ? Math.round((paidInvoices.length / visibleInvoices.length) * 100) : 0;
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {isStudent ? 'My Payments' : 'Payments & Finance'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isStudent
            ? 'Review your own invoices, balances, and payment status.'
            : 'Track revenue, invoice status, payment methods, and collection performance.'}
          </p>
        </div>
        {!isStudent && (<Button asChild>
            <Link to="/payments/invoices">
              <Plus />
              Manage Invoices
            </Link>
          </Button>)}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FinanceMetricCard title={isStudent ? 'Paid Amount' : 'Total Revenue'} value={formatCurrency(totalRevenue)} description={isStudent ? 'Collected from your paid invoices' : 'Collected from paid invoices'} icon={Banknote} tone="emerald"/>
        <FinanceMetricCard title="Pending Payments" value={formatCurrency(pendingPayments)} description={`${pendingInvoices.length} invoices need attention`} icon={CreditCard} tone="amber"/>
        <FinanceMetricCard title="Paid Invoices" value={paidInvoices.length} description={`${paidInvoices.length} of ${visibleInvoices.length} invoices paid`} icon={CheckCircle2} tone="sky"/>
        <FinanceMetricCard title="Collection Rate" value={`${collectionRate}%`} description="Current term payment collection" icon={TrendingUp} tone="teal"/>
      </div>

      {!isStudent && (<div className="grid gap-4 xl:grid-cols-2">
          <RevenueChart />
          <CollectionTrendChart />
        </div>)}

      <Card>
        <CardHeader>
          <CardTitle>{isStudent ? 'My Payment Records' : 'Payment Records'}</CardTitle>
          <CardDescription>
            {isStudent
            ? 'Search and review your own payment activity.'
            : 'Search, filter, export, and review student payment activity.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentsDataTable data={visibleInvoices} isStudent={isStudent}/>
        </CardContent>
      </Card>
    </div>);
}
