import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { Badge } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/common/TableSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldError, fieldErrorId } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getRoles, createRole, updateRole, deleteRole } from '@/services/roles.service';
import { useAuth } from '@/hooks/useAuth';

const roleSchema = z.object({
    name: z.string().min(1, 'Role name is required.').max(100),
});

const PERMISSION_LABELS = {
    'dashboard:view': 'View Dashboard',
    'students:manage': 'Manage Students',
    'students:view': 'View Students',
    'courses:manage': 'Manage Courses',
    'courses:view': 'View Courses',
    'attendance:manage': 'Manage Attendance',
    'attendance:view': 'View Attendance',
    'results:manage': 'Manage Results',
    'results:view': 'View Results',
    'payments:manage': 'Manage Payments',
    'payments:view': 'View Payments',
    'settings:manage': 'Manage Settings',
};

export function RolesList() {
    const { can } = useAuth();
    const canManage = can('settings:manage');
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { register, handleSubmit: rhfHandleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(roleSchema),
        defaultValues: { name: '' },
    });

    const fetchRoles = useCallback(() => {
        setLoading(true);
        getRoles()
            .then((data) => setRoles(Array.isArray(data) ? data : []))
            .catch(() => setError('Failed to load roles.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchRoles(); }, [fetchRoles]);

    function openCreateDialog() {
        setEditingRole(null);
        reset({ name: '' });
        setDialogOpen(true);
    }

    function openEditDialog(role) {
        setEditingRole(role);
        reset({ name: role.name });
        setDialogOpen(true);
    }

    async function onSubmit(data) {
        try {
            if (editingRole) {
                await updateRole(editingRole.id, { name: data.name.trim() });
                toast.success('Role updated.');
            } else {
                await createRole({ name: data.name.trim() });
                toast.success('Role created.');
            }
            setDialogOpen(false);
            reset({ name: '' });
            setEditingRole(null);
            fetchRoles();
        } catch (err) {
            toast.error(err.message || 'Failed to save role.');
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteRole(deleteTarget.id);
            toast.success('Role deleted.');
            setRoles((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        } catch (err) {
            toast.error(err.message || 'Failed to delete role.');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    }

    function parsePermissions(permissions) {
        if (!permissions) return [];
        if (typeof permissions === 'string') {
            try { return JSON.parse(permissions); } catch { return []; }
        }
        return Array.isArray(permissions) ? permissions : [];
    }

    return (<div className="space-y-6">
      <ConfirmationDialog open={Boolean(deleteTarget)} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }} title="Delete Role" description={`Are you sure you want to delete role "${deleteTarget?.name}"? This action cannot be undone.`} confirmLabel="Delete" loading={deleting} onConfirm={handleDelete}/>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">{loading ? '' : `${roles.length} role${roles.length !== 1 ? 's' : ''} configured`}</p>
        </div>
        <Button onClick={openCreateDialog} disabled={!canManage}><Plus /> Add Role</Button>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchRoles} />}

      {loading ? <TableSkeleton /> : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => {
            const perms = parsePermissions(role.permissions);
            const isBuiltin = role.name === 'Admin' || role.name === 'SuperAdmin';
            return (<Card key={role.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary"/>
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                </div>
                {!isBuiltin && canManage && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(role)}>
                      <Pencil className="size-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteTarget(role)}>
                      <Trash2 className="size-4"/>
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {perms.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {perms.map((p) => (<Badge key={p} variant="secondary" className="text-xs">{PERMISSION_LABELS[p] || p}</Badge>))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No permissions assigned.</p>
                )}
              </CardContent>
            </Card>);
        })}
      </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
            <DialogDescription>{editingRole ? 'Update the role name.' : 'Add a new role to the system.'}</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={rhfHandleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input id="role-name" {...register('name')} placeholder="e.g. Librarian" aria-invalid={!!errors.name} aria-describedby={errors.name ? fieldErrorId('role-name') : undefined}/>
              <FieldError id={fieldErrorId('role-name')} message={errors.name?.message}/>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingRole ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>);
}
