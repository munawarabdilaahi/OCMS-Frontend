import { Check, LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { PERMISSIONS, ROLES, hasPermission, roleOptions } from '@/lib/roles';
function PermissionIcon({ allowed }) {
    if (allowed) {
        return (<span className="inline-flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
        <Check className="size-4"/>
      </span>);
    }
    return (<span className="inline-flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
      <X className="size-4"/>
    </span>);
}
export function Permissions() {
    const totalAssignments = roleOptions.reduce((total, role) => {
        return total + PERMISSIONS.filter((permission) => hasPermission(role, permission.key)).length;
    }, 0);
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Permissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Audit the frontend RBAC matrix used by protected routes and sidebar visibility.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Roles</CardTitle>
              <CardDescription>Configured OCMS roles</CardDescription>
            </div>
            <ShieldCheck className="size-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{roleOptions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Permissions</CardTitle>
              <CardDescription>Available access rules</CardDescription>
            </div>
            <LockKeyhole className="size-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{PERMISSIONS.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assignments</CardTitle>
            <CardDescription>Role-to-permission grants</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalAssignments}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>Admin has full access; all other roles are limited by module scope.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-64">Permission</TableHead>
                  {roleOptions.map((role) => (<TableHead key={role} className="text-center">
                      {role}
                    </TableHead>))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {PERMISSIONS.map((permission) => (<TableRow key={permission.key}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{permission.label}</p>
                          <Badge variant="secondary">{permission.module}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{permission.description}</p>
                      </div>
                    </TableCell>
                    {roleOptions.map((role) => (<TableCell key={role} className="text-center">
                        <PermissionIcon allowed={role === ROLES.ADMIN || hasPermission(role, permission.key)}/>
                      </TableCell>))}
                  </TableRow>))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>);
}
