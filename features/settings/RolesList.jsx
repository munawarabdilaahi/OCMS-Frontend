import { BookOpen, CreditCard, GraduationCap, ShieldCheck, UserRoundCheck, Users } from 'lucide-react';
import { Link } from '@/lib/router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PERMISSIONS, ROLE_DESCRIPTIONS, ROLES, getRolePermissions, roleOptions } from '@/lib/roles';
const roleIcons = {
    [ROLES.ADMIN]: ShieldCheck,
    [ROLES.REGISTRAR]: GraduationCap,
    [ROLES.TEACHER]: UserRoundCheck,
    [ROLES.ACCOUNTANT]: CreditCard,
    [ROLES.STUDENT]: BookOpen,
};
const roleScopes = {
    [ROLES.ADMIN]: 'Full Access',
    [ROLES.REGISTRAR]: 'Students + Courses',
    [ROLES.TEACHER]: 'Attendance + Results',
    [ROLES.ACCOUNTANT]: 'Payments',
    [ROLES.STUDENT]: 'View Only',
};
export function RolesList() {
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Roles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review OCMS role scopes and the permissions attached to each role.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/settings/permissions">
            <ShieldCheck />
            Permission Matrix
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roleOptions.map((role) => {
            const Icon = roleIcons[role] ?? Users;
            const permissions = getRolePermissions(role);
            return (<Card key={role}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{role}</CardTitle>
                  <CardDescription>{roleScopes[role]}</CardDescription>
                </div>
                <span className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-emerald-700 dark:text-teal-200">
                  <Icon className="size-5"/>
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">{ROLE_DESCRIPTIONS[role]}</p>
                <div className="flex flex-wrap gap-2">
                  {(role === ROLES.ADMIN ? PERMISSIONS : PERMISSIONS.filter((permission) => permissions.includes(permission.key)))
                    .slice(0, 5)
                    .map((permission) => (<Badge key={permission.key} variant="secondary">
                        {permission.module}
                      </Badge>))}
                </div>
                <p className="text-sm font-medium">
                  {role === ROLES.ADMIN ? PERMISSIONS.length : permissions.length} permissions
                </p>
              </CardContent>
            </Card>);
        })}
      </div>
    </div>);
}
