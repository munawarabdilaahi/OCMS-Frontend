/* eslint-disable react-hooks/incompatible-library */
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowUpDown, Download, Eye, MoreHorizontal, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
import { z } from 'zod';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { cn } from '@/lib/cn';
import { formatCurrency, formatDate, invoices, paymentStatuses } from '@/features/payments/PaymentsList';
const invoiceSchema = z.object({
    student: z.string().trim().min(2, 'Student name is required'),
    studentId: z.string().trim().min(3, 'Student ID is required'),
    program: z.string().trim().min(2, 'Program is required'),
    amount: z.coerce.number().min(1, 'Amount is required'),
    dueDate: z.string().trim().min(1, 'Due date is required'),
    description: z.string().trim().min(3, 'Description is required'),
});
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
        .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
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
    const invoiceForm = useForm({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            student: '',
            studentId: '',
            program: '',
            amount: '',
            dueDate: '',
            description: '',
        },
    });
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
            cell: ({ row }) => (<Badge className={cn('whitespace-nowrap', statusStyles[row.original.status])}>{row.original.status}</Badge>),
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
        data: invoices,
        columns,
        state: {
            sorting,
            globalFilter,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 6,
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
    const totalInvoiced = invoices.reduce((total, invoice) => total + invoice.amount, 0);
    const totalBalance = invoices.reduce((total, invoice) => total + invoice.balance, 0);
    const createInvoice = (values) => {
        toast.success(`Invoice created for ${values.student}.`);
        invoiceForm.reset();
    };
    const invalidInvoice = () => toast.error('Please complete the required invoice fields.');
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
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button">
              <Plus />
              New Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">New Invoice</h2>
              <p className="text-sm text-muted-foreground">Create a student invoice record.</p>
            </div>
            <form className="grid gap-4" onSubmit={invoiceForm.handleSubmit(createInvoice, invalidInvoice)}>
              <div className="grid gap-4 md:grid-cols-2">
                {[
            ['student', 'Student Name'],
            ['studentId', 'Student ID'],
            ['program', 'Program'],
            ['amount', 'Amount'],
            ['dueDate', 'Due Date'],
            ['description', 'Description'],
        ].map(([name, label]) => (<div key={name} className="space-y-2">
                    <Label htmlFor={name}>{label}</Label>
                    <Input id={name} type={name === 'amount' ? 'number' : name === 'dueDate' ? 'date' : 'text'} aria-invalid={Boolean(invoiceForm.formState.errors[name])} {...invoiceForm.register(name)}/>
                    {invoiceForm.formState.errors[name] ? (<p className="text-xs text-destructive">{invoiceForm.formState.errors[name].message}</p>) : null}
                  </div>))}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => invoiceForm.reset()}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus />
                  Save Invoice
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Invoiced</CardTitle>
            <CardDescription>All issued invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(totalInvoiced)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Outstanding Balance</CardTitle>
            <CardDescription>Pending, overdue, and failed invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(totalBalance)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Open Invoices</CardTitle>
            <CardDescription>Invoices not fully paid</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{invoices.filter((invoice) => invoice.status !== 'Paid').length}</p>
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
                          {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                        <EmptyState title="No invoices found" description="Adjust your filters or create a new invoice." actionLabel="New Invoice" onAction={() => toast.info('Use the New Invoice button above to create an invoice.')}/>
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
