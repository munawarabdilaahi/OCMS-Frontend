import { ArrowLeft, ArrowUpDown, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
import { EmptyState } from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/TableSkeleton';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/features/payments/payment-constants';
import { getFees, createFee, updateFee, deleteFee } from '@/services/payments.service';
import { getDepartments } from '@/services/departments.service';
import { SortButton } from '@/components/ui/data-table';
import { COURSE_STATUS_STYLES as statusStyles } from '@/lib/status-styles';
const feeSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    description: z.string().optional().default(''),
    amount: z.string().min(1, 'Amount is required.'),
    department_id: z.string().optional().default(''),
    academic_year: z.string().min(1, 'Academic year is required.'),
    semester: z.string().optional().default(''),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export function FeesList() {
    const [fees, setFees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingFee, setEditingFee] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const { register, handleSubmit: rhfHandleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(feeSchema),
        defaultValues: { name: '', description: '', amount: '', department_id: '', academic_year: '', semester: '', status: 'ACTIVE' },
    });

    const fetchData = useCallback(() => {
        setLoading(true);
        Promise.all([getFees(), getDepartments()])
            .then(([feeData, deptData]) => {
                setFees(Array.isArray(feeData) ? feeData : []);
                setDepartments(Array.isArray(deptData) ? deptData : []);
            })
            .catch(() => setError('Failed to load fee structures.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    function openCreate() {
        setEditingFee(null);
        reset({ name: '', description: '', amount: '', department_id: '', academic_year: '', semester: '', status: 'ACTIVE' });
        setDialogOpen(true);
    }

    function openEdit(fee) {
        setEditingFee(fee);
        reset({
            name: fee.name,
            description: fee.description || '',
            amount: String(fee.amount),
            department_id: fee.department_id ? String(fee.department_id) : '',
            academic_year: fee.academic_year,
            semester: fee.semester || '',
            status: fee.status,
        });
        setDialogOpen(true);
    }

    async function onSubmit(data) {
        try {
            const payload = {
                name: data.name.trim(),
                description: (data.description || '').trim(),
                amount: Number(data.amount),
                department_id: data.department_id ? Number(data.department_id) : null,
                academic_year: data.academic_year.trim(),
                semester: (data.semester || '').trim(),
                status: data.status,
            };
            if (editingFee) {
                await updateFee(editingFee.id, payload);
                toast.success('Fee structure updated.');
            } else {
                await createFee(payload);
                toast.success('Fee structure created.');
            }
            setDialogOpen(false);
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to save fee structure.');
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteFee(deleteTarget.id);
            toast.success('Fee structure deleted.');
            setFees((prev) => prev.filter((f) => f.id !== deleteTarget.id));
        } catch (err) {
            toast.error(err.message || 'Failed to delete.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: ({ column }) => <SortButton column={column}>Name</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => <SortButton column={column}>Amount</SortButton>,
            cell: ({ row }) => formatCurrency(row.original.amount),
        },
        {
            accessorKey: 'department',
            header: 'Department',
            cell: ({ row }) => row.original.department || 'All',
        },
        {
            accessorKey: 'academic_year',
            header: 'Year',
        },
        {
            accessorKey: 'semester',
            header: 'Semester',
            cell: ({ row }) => row.original.semester || '-',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status}</Badge>,
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}><Pencil className="size-4"/></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteTarget(row.original)}><Trash2 className="size-4"/></Button>
                </div>
            ),
        },
    ], []);

    const table = useReactTable({
        data: fees,
        columns,
        state: { sorting, globalFilter },
        initialState: { pagination: { pageSize: 10 } },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (<div className="space-y-6">
      <ConfirmationDialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }} title="Delete Fee Structure" description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} confirmLabel="Delete" loading={deleting} onConfirm={handleDelete}/>
      <div className="space-y-3">
        <Button asChild type="button" variant="ghost" className="-ml-3 w-fit">
          <Link to="/payments"><ArrowLeft /> Back to payments</Link>
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Fee Structures</h1>
            <p className="mt-1 text-sm text-muted-foreground">{loading ? 'Loading...' : `${fees.length} fee structure(s)`}</p>
          </div>
          <Button onClick={openCreate}><Plus /> Add Fee Structure</Button>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchData} />}

      <Card>
        <CardContent className="pt-6">
          {loading ? <TableSkeleton /> : (
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
              <Input className="pl-9" placeholder="Search fee structures..." value={globalFilter ?? ''} onChange={(e) => setGlobalFilter(e.target.value)}/>
            </div>
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (<TableRow key={hg.id}>
                    {hg.headers.map((h) => (<TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}
                  </TableRow>))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>{row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}</TableRow>
                  ))) : (<TableRow><TableCell colSpan={columns.length} className="p-6"><EmptyState title="No fee structures" description="Create a fee structure to get started."/></TableCell></TableRow>)}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
              </div>
            </div>
          </div>)}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingFee ? 'Edit Fee Structure' : 'Create Fee Structure'}</DialogTitle>
            <DialogDescription>{editingFee ? 'Update fee structure details.' : 'Add a new fee structure.'}</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4 py-2" onSubmit={rhfHandleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="fee-name">Name *</Label>
              <Input id="fee-name" {...register('name')} placeholder="e.g. Tuition Fee" aria-invalid={!!errors.name} aria-describedby={errors.name ? fieldErrorId('fee-name') : undefined}/>
              <FieldError id={fieldErrorId('fee-name')} message={errors.name?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee-desc">Description</Label>
              <Input id="fee-desc" {...register('description')} placeholder="Optional description"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fee-amount">Amount ($) *</Label>
                <Input id="fee-amount" type="number" {...register('amount')} placeholder="0" aria-invalid={!!errors.amount} aria-describedby={errors.amount ? fieldErrorId('fee-amount') : undefined}/>
                <FieldError id={fieldErrorId('fee-amount')} message={errors.amount?.message}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee-year">Academic Year *</Label>
                <Input id="fee-year" {...register('academic_year')} placeholder="e.g. 2025-2026" aria-invalid={!!errors.academic_year} aria-describedby={errors.academic_year ? fieldErrorId('fee-year') : undefined}/>
                <FieldError id={fieldErrorId('fee-year')} message={errors.academic_year?.message}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={watch('department_id') || 'all'} onValueChange={(v) => setValue('department_id', v === 'all' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="All departments"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((d) => (<SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={watch('semester') || 'none'} onValueChange={(v) => setValue('semester', v === 'none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Optional"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Fall">Fall</SelectItem>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={watch('status')} onValueChange={(v) => setValue('status', v)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingFee ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>);
}
