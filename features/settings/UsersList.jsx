import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, Download, MoreHorizontal, Plus, Search, Trash2, UserCog } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/users.service';
import { getRoles } from '@/services/roles.service';
import { cn } from '@/lib/cn';

const statusStyles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    DELETED: 'bg-destructive/10 text-destructive',
};

function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}

export function UsersList() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formRoleId, setFormRoleId] = useState('');
    const [formStatus, setFormStatus] = useState('ACTIVE');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(() => {
        setLoading(true);
        Promise.all([getUsers(), getRoles()])
            .then(([usersRes, rolesData]) => {
                const data = usersRes?.data ?? [];
                setUsers(Array.isArray(data) ? data : []);
                setRoles(Array.isArray(rolesData) ? rolesData : []);
            })
            .catch(() => setError('Failed to load users.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    function openCreate() {
        setEditUser(null);
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setFormRoleId(roles[0]?.id?.toString() || '');
        setFormStatus('ACTIVE');
        setDialogOpen(true);
    }

    function openEdit(user) {
        setEditUser(user);
        setFormName(user.name || '');
        setFormEmail(user.email || '');
        setFormPassword('');
        setFormRoleId(user.role_id?.toString() || '');
        setFormStatus(user.status || 'ACTIVE');
        setDialogOpen(true);
    }

    async function handleSubmit() {
        if (!formName.trim() || !formEmail.trim()) {
            toast.error('Name and email are required.');
            return;
        }
        if (!editUser && !formPassword.trim()) {
            toast.error('Password is required for new users.');
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = { name: formName.trim(), email: formEmail.trim(), role_id: Number(formRoleId), status: formStatus };
            if (formPassword.trim()) payload.password = formPassword.trim();
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
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(userId) {
        if (!window.confirm('Delete this user?')) return;
        try {
            await deleteUser(userId);
            toast.success('User deleted.');
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            toast.error(err.message || 'Failed to delete user.');
        }
    }

    const columns = useMemo(() => [
        { accessorKey: 'id', header: ({ column }) => <SortButton column={column}>ID</SortButton>, cell: ({ row }) => <span className="font-medium">{row.original.id}</span> },
        { accessorKey: 'name', header: ({ column }) => <SortButton column={column}>Name</SortButton> },
        { accessorKey: 'email', header: ({ column }) => <SortButton column={column}>Email</SortButton> },
        { accessorKey: 'role', header: ({ column }) => <SortButton column={column}>Role</SortButton>, cell: ({ row }) => <Badge variant="secondary">{row.original.role || '-'}</Badge> },
        { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status}</Badge> },
        {
            id: 'actions', header: 'Actions', enableHiding: false,
            cell: ({ row }) => (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon"><MoreHorizontal /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => openEdit(row.original)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(row.original.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>),
        },
    ], [roles]);

    const table = useReactTable({
        data: users, columns,
        state: { sorting: [], globalFilter: '' },
        initialState: { pagination: { pageSize: 10 } },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">{loading ? 'Loading...' : `${users.length} user${users.length !== 1 ? 's' : ''}`}</p>
        </div>
        <Button onClick={openCreate}><Plus /> Add User</Button>
      </div>

      {error && (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts, roles, and status.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading users...</p></div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((hg) => (<TableRow key={hg.id}>
                      {hg.headers.map((h) => (<TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}
                    </TableRow>))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={columns.length} className="p-6"><EmptyState title="No users found" description="Create a user to get started."/></TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editUser ? 'Edit User' : 'Create User'}</DialogTitle>
            <DialogDescription>{editUser ? 'Update user details and role.' : 'Add a new user to the system.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={formName} onChange={(e) => setFormName(e.target.value)}/></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)}/></div>
            <div className="space-y-2"><Label>{editUser ? 'New Password (leave blank to keep)' : 'Password'}</Label><Input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)}/></div>
            <div className="space-y-2"><Label>Role</Label>
              <Select value={formRoleId} onValueChange={setFormRoleId}>
                <SelectTrigger><SelectValue placeholder="Select role"/></SelectTrigger>
                <SelectContent>{roles.map((r) => (<SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="INACTIVE">Inactive</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);
}
