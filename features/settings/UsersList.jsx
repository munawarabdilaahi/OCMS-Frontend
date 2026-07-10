/* eslint-disable react-hooks/incompatible-library */
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { ROLES, roleOptions } from '@/lib/roles';
const userSchema = z.object({
    name: z.string().trim().min(2, 'Name is required'),
    email: z.string().trim().email('Enter a valid email'),
    role: z.string().trim().min(1, 'Role is required'),
});
const roleStyles = {
    [ROLES.ADMIN]: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    [ROLES.REGISTRAR]: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    [ROLES.TEACHER]: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    [ROLES.ACCOUNTANT]: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    [ROLES.STUDENT]: 'bg-secondary text-secondary-foreground',
};
function getInitials(name) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}
export function UsersList() {
    const { users } = useAuth();
    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            role: ROLES.STUDENT,
        },
    });
    const submitUser = (values) => {
        toast.success(`${values.name} has been added as ${values.role}.`);
        form.reset();
    };
    const invalidUser = () => toast.error('Please fix the highlighted user fields.');
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage mock OCMS user accounts and their assigned RBAC roles.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button">
              <UserPlus />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Add User</h2>
              <p className="text-sm text-muted-foreground">Create a frontend mock account for OCMS testing.</p>
            </div>
            <form className="space-y-4" onSubmit={form.handleSubmit(submitUser, invalidUser)}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" aria-invalid={Boolean(form.formState.errors.name)} {...form.register('name')}/>
                {form.formState.errors.name ? <p className="text-xs text-destructive">{form.formState.errors.name.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" aria-invalid={Boolean(form.formState.errors.email)} {...form.register('email')}/>
                {form.formState.errors.email ? <p className="text-xs text-destructive">{form.formState.errors.email.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={form.watch('role')} onValueChange={(value) => form.setValue('role', value, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Cancel
                </Button>
                <Button type="submit">
                  <UserPlus />
                  Save User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Total Users</CardTitle>
              <CardDescription>Mock authenticated accounts</CardDescription>
            </div>
            <Users className="size-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Active Users</CardTitle>
              <CardDescription>Ready for role-based access</CardDescription>
            </div>
            <ShieldCheck className="size-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{users.filter((user) => user.status === 'Active').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Admin Accounts</CardTitle>
              <CardDescription>Full system access</CardDescription>
            </div>
            <ShieldCheck className="size-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{users.filter((user) => user.role === ROLES.ADMIN).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>Frontend mock users used for OCMS role testing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (<TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <Mail className="size-4 text-muted-foreground"/>
                        {user.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleStyles[user.role]}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.status}</Badge>
                    </TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>);
}
