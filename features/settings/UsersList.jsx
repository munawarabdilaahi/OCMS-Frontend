import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpDown, MoreHorizontal, Plus, Trash2, UserCog } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/TableSkeleton';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/users.service';
import { getRoles } from '@/services/roles.service';
import { cn } from '@/lib/cn';
import { SortButton } from '@/components/ui/data-table';
import { useAuth } from '@/hooks/useAuth';
import { TEACHER_STATUS_STYLES as statusStyles } from '@/lib/status-styles';

const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    email: z.string().email('Enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    role_id: z.string().min(1, 'Role is required.'),
    status: z.string().min(1, 'Status is required.'),
});

const editUserSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    email: z.string().email('Enter a valid email address.'),
    password: z.string().optional(),
    role_id: z.string().min(1, 'Role is required.'),
    status: z.string().min(1, 'Status is required.'),
});

export function UsersList() {
    const { can } = useAuth();
    const canManage = can('settings:manage');
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [sorting, setSorting] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    const isEdit = Boolean(editUser);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, control } = useForm({
        resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
        defaultValues: { name: '', email: '', password: '', role_id: '', status: 'ACTIVE' },
    });

    const fetchData = useCallback(() => {
        setLoading(true);
        const params = { page, pageSize };
        if (search.trim()) params.search = search.trim();
        Promise.all([getUsers(params), getRoles()])
            .then(([usersRes, rolesData]) => {
                const data = usersRes?.data ?? [];
                setUsers(Array.isArray(data) ? data : []);
                setTotalCount(usersRes?.meta?.total ?? data.length);
                setRoles(Array.isArray(rolesData?.data) ? rolesData.data : Array.isArray(rolesData) ? rolesData : []);
            })
            .catch(() => setError('Failed to load users.'))
            .finally(() => setLoading(false));
    }, [search, page]);

    useEffect(() => { fetchData(); }, [fetchData]);

    function openCreate() {
        setEditUser(null);
        reset({ name: '', email: '', password: '', role_id: roles[0]?.id?.toString() || '', status: 'ACTIVE' });
        setDialogOpen(true);
    }

    function openEdit(user) {
        setEditUser(user);
        reset({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role_id: user.role_id?.toString() || '',
            status: user.status || 'ACTIVE',
        });
        setDialogOpen(true);
    }

    async function onSubmit(values) {
        try {
            const payload = { name: values.name.trim(), email: values.email.trim(), role_id: Number(values.role_id), status: values.status };
            if (values.password?.trim()) payload.password = values.password.trim();
            if (editUser) {
                await updateUser(editUser.id, payload);
                toast.success('User updated successfully.');
            } else {
                await createUser(payload);
                toast.success('User created successfully.');
            }
            setDialogOpen(false);
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to save user.');
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteUser(deleteTarget.id);
            toast.success('User deleted.');
            fetchData();
        } catch (err) {
            toast.error(err.message || 'Failed to delete user.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }

    const columns = useMemo(() => [
        { accessorKey: 'id', header: ({ column }) => <SortButton column={column}>ID</SortButton>, cell: ({ row }) => <span className="font-medium">{row.original.id}</span> },
        { accessorKey: 'name', header: ({ column }) => <SortButton column={column}>Name</SortButton> },
        { accessorKey: 'email', header: ({ column }) => <SortButton column={column}>Email</SortButton> },
        { accessorKey: 'role', header: ({ column }) => <SortButton column={column}>Role</SortButton>, cell: ({ row }) => <Badge variant="secondary">{row.original.role || '-'}</Badge> },
        { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status}</Badge> },
        { id: 'actions', header: 'Actions', enableHiding: false, cell: ({ row }) => (<DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">{canManage && (<><DropdownMenuItem onSelect={() => openEdit(row.original)}>Edit</DropdownMenuItem><DropdownMenuItem className="text-destructive" onSelect={() => setDeleteTarget(row.original)}>Delete</DropdownMenuItem></>)}</DropdownMenuContent></DropdownMenu>) },
    ], [canManage]);

    const table = useReactTable({ data: users, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });
    const pageCount = Math.ceil(totalCount / pageSize);

    return (<div className="space-y-6">
      <ConfirmationDialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }} title="Delete User" description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} confirmLabel="Delete" loading={deleting} onConfirm={handleDelete}/>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">{loading ? 'Loading...' : `${totalCount} user${totalCount !== 1 ? 's' : ''}`}</p>
        </div>
        <Button onClick={openCreate} disabled={!canManage}><Plus /> Add User</Button>
      </div>
      <ErrorAlert message={error} onRetry={fetchData} />
      <Card>
        <CardHeader><CardTitle>User Management</CardTitle><CardDescription>Manage user accounts, roles, and status.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Input placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}/>
          </div>
          {loading ? (<TableSkeleton />) : (<div className="space-y-4">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>{table.getHeaderGroups().map((hg) => (<TableRow key={hg.id}>{hg.headers.map((h) => (<TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}</TableRow>))}</TableHeader>
                <TableBody>{table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => (<TableRow key={row.id}>{row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}</TableRow>)) : (<TableRow><TableCell colSpan={columns.length} className="p-6"><EmptyState title="No users found" description="Create a user to get started."/></TableCell></TableRow>)}</TableBody>
              </Table>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalCount)} of {totalCount} users</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {page} of {pageCount || 1}</span>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount}>Next</Button>
              </div>
            </div>
          </div>)}
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editUser ? 'Edit User' : 'Create User'}</DialogTitle><DialogDescription>{editUser ? 'Update user details and role.' : 'Add a new user to the system.'}</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="user-name">Name</Label>
              <Input id="user-name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldErrorId('user-name') : undefined} {...register('name')}/>
              <FieldError id={fieldErrorId('user-name')} message={errors.name?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input id="user-email" type="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? fieldErrorId('user-email') : undefined} {...register('email')}/>
              <FieldError id={fieldErrorId('user-email')} message={errors.email?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-password">{editUser ? 'New Password (leave blank to keep)' : 'Password'}</Label>
              <Input id="user-password" type="password" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? fieldErrorId('user-password') : undefined} {...register('password')}/>
              <FieldError id={fieldErrorId('user-password')} message={errors.password?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <select id="user-role" className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring" {...register('role_id')}>
                {roles.map((r) => (<option key={r.id} value={String(r.id)}>{r.name}</option>))}
              </select>
              <FieldError id={fieldErrorId('user-role')} message={errors.role_id?.message}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-status">Status</Label>
              <select id="user-status" className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring" {...register('status')}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <FieldError id={fieldErrorId('user-status')} message={errors.status?.message}/>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>);
}
