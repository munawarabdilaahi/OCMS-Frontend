import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, KeyRound, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from '@/lib/router';
import { z } from 'zod';
import { PasswordField } from '@/components/auth/PasswordField';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/lib/roles';
const schema = z.object({
    email: z.string().email('Enter a valid institutional email.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    role: z.enum(Object.values(ROLES)),
});
export function Login() {
    const { login, isAuthenticated } = useAuth();
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            role: ROLES.ADMIN,
        },
    });
    async function onSubmit(values) {
        setSubmitError('');
        try {
            await login(values);
            navigate(from, { replace: true });
        }
        catch (error) {
            setSubmitError(error.message || 'Unable to sign in. Please try again.');
        }
    }
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace/>;
    }
    return (<Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-0 sm:px-6">
        <div className="mb-3 flex size-11 items-center justify-center rounded-md bg-primary/15 text-emerald-700 dark:text-teal-200">
          <KeyRound className="size-5"/>
        </div>
        <CardTitle className="text-2xl">Sign in to OCMS</CardTitle>
        <CardDescription>Choose a role to preview the protected campus workspace.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {submitError && (<Alert variant="destructive">
              <AlertTitle>Sign in failed</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>)}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="admin@ocms.edu" disabled={isSubmitting} aria-invalid={Boolean(errors.email)} {...register('email')}/>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Password</Label>
              <Link className="text-sm font-medium text-primary hover:underline" to="/forgot-password">
                Forgot password?
              </Link>
            </div>
            <PasswordField id="password" autoComplete="current-password" placeholder="Enter your password" disabled={isSubmitting} invalid={Boolean(errors.password)} registration={register('password')}/>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select defaultValue={ROLES.ADMIN} disabled={isSubmitting} onValueChange={(value) => setValue('role', value, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role"/>
              </SelectTrigger>
              <SelectContent>
                {Object.values(ROLES).map((role) => (<SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (<>
                <Loader2 className="animate-spin"/>
                Signing in
              </>) : (<>
                Sign in
                <ArrowRight />
              </>)}
          </Button>
        </form>
      </CardContent>
    </Card>);
}
