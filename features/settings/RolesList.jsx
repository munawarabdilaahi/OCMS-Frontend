import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getRoles, createRole, updateRole, deleteRole } from '@/services/roles.service';

const PERMISSION_LABELS = {
    'dashboard:view': 'View Dashboard',
    'students:manage': 'Manage Students',
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
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [roleName, setRoleName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setRoleName('');
        setDialogOpen(true);
    }

    function openEditDialog(role) {
        setEditingRole(role);
        setRoleName(role.name);
        setDialogOpen(true);
    }

    async function handleSubmit() {
        if (!roleName.trim()) { toast.error('Role name is required.'); return; }
        setIsSubmitting(true);
        try {
            if (editingRole) {
                await updateRole(editingRole.id, { name: roleName.trim() });
                toast.success('Role updated.');
            } else {
                await createRole({ name: roleName.trim() });
                toast.success('Role created.');
            }
            setDialogOpen(false);
            setRoleName('');
            setEditingRole(null);
            fetchRoles();
        } catch (err) {
            toast.error(err.message || 'Failed to save role.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(roleId, roleName) {
        if (!window.confirm(`Delete role "${roleName}"?`)) return;
        try {
            await deleteRole(roleId);
            toast.success('Role deleted.');
            setRoles((prev) => prev.filter((r) => r.id !== roleId));
        } catch (err) {
            toast.error(err.message || 'Failed to delete role.');
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">{loading ? 'Loading...' : `${roles.length} role${roles.length !== 1 ? 's' : ''} configured`}</p>
        </div>
        <Button onClick={openCreateDialog}><Plus /> Add Role</Button>
      </div>

      {error && (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}

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
                {!isBuiltin && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(role)}>
                      <Pencil className="size-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(role.id, role.name)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
            <DialogDescription>{editingRole ? 'Update the role name.' : 'Add a new role to the system.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Role Name</Label><Input value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. Librarian"/></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingRole ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);
}
