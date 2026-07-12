import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
export function UsersList() {
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage OCMS user accounts and their assigned RBAC roles.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>User administration is available once the backend service is connected.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <Users className="size-12 text-muted-foreground/50"/>
          <div>
            <p className="font-medium">No user management yet</p>
            <p className="text-sm text-muted-foreground">
              Connect the backend API to manage users, roles, and permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>);
}
