import { ArrowLeft, ArrowUpDown, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
import { EmptyState } from '@/components/common/EmptyState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/features/payments/PaymentsList';
import { getFees, createFee, updateFee, deleteFee } from '@/services/payments.service';
import { getDepartments } from '@/services/departments.service';

const statusStyles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-muted text-muted-foreground',
};

function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}<ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}

const emptyForm = { name: '', description: '', amount: '', department_id: '', academic_year: '', semester: '', status: 'ACTIVE' };

export function FeesList() {
    const [fees, setFees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingFee, setEditingFee] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

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
        setForm(emptyForm);
        setDialogOpen(true);
    }

    function openEdit(fee) {
        setEditingFee(fee);
        setForm({
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

    async function handleSubmit() {
        if (!form.name.trim() || !form.amount || !form.academic_year.trim()) {
            toast.error('Name, amount, and academic year are required.');
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                amount: Number(form.amount),
                department_id: form.department_id ? Number(form.department_id) : null,
                academic_year: form.academic_year.trim(),
                semester: form.semester.trim(),
                status: form.status,
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
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(feeId, feeName) {
        if (!window.confirm(`Delete fee structure "${feeName}"?`)) return;
        try {
            await deleteFee(feeId);
            toast.success('Fee structure deleted.');
            setFees((prev) => prev.filter((f) => f.id !== feeId));
        } catch (err) {
            toast.error(err.message || 'Failed to delete.');
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
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(row.original.id, row.original.name)}><Trash2 className="size-4"/></Button>
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

      {error && (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}

      <Card>
        <CardContent className="pt-6">
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
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
          <div className="grid gap-4 py-2">
            <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Tuition Fee"/></div>
            <div className="space-y-2"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description"/></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Amount ($) *</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0"/></div>
              <div className="space-y-2"><Label>Academic Year *</Label><Input value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} placeholder="e.g. 2025-2026"/></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={form.department_id || 'all'} onValueChange={(v) => setForm({ ...form, department_id: v === 'all' ? '' : v })}>
                  <SelectTrigger><SelectValue placeholder="All departments"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((d) => (<SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={form.semester || 'none'} onValueChange={(v) => setForm({ ...form, semester: v === 'none' ? '' : v })}>
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
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingFee ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);
}
