import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from '@/lib/router';
import { z } from 'zod';
import { PasswordField } from '@/components/auth/PasswordField';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordRequest } from '@/services/auth.service';
const schema = z
    .object({
    token: z.string().min(1, 'Reset token is required.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Confirm your new password.'),
})
    .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match.',
});
export function ResetPassword() {
    const [submitError, setSubmitError] = useState('');
    const [isReset, setIsReset] = useState(false);
    const tokenFromUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') || '' : '';
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { token: tokenFromUrl, password: '', confirmPassword: '' },
    });
    async function onSubmit(values) {
        setSubmitError('');
        setIsReset(false);
        try {
            await resetPasswordRequest({ token: values.token, password: values.password, confirmPassword: values.confirmPassword });
            setIsReset(true);
        }
        catch (error) {
            setSubmitError(error.message || 'Unable to reset password. Please try again.');
        }
    }
    return (<Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-0 sm:px-6">
        <div className="mb-3 flex size-11 items-center justify-center rounded-md bg-primary/15 text-emerald-700 dark:text-teal-200">
          <LockKeyhole className="size-5"/>
        </div>
        <CardTitle className="text-2xl">Set a new password</CardTitle>
        <CardDescription>Create a stronger password for your OCMS account.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {submitError && (<Alert variant="destructive">
              <AlertTitle>Password reset failed</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>)}
          {isReset && (<Alert variant="success">
              <AlertTitle>Password ready</AlertTitle>
              <AlertDescription>Your password has been reset successfully. You can now sign in.</AlertDescription>
            </Alert>)}
          <div className="space-y-2">
            <Label htmlFor="token">Reset Token</Label>
            <Input id="token" type="text" placeholder="Enter your reset token" disabled={isSubmitting} aria-invalid={Boolean(errors.token)} {...register('token')}/>
            {errors.token && <p className="text-sm text-destructive">{errors.token.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <PasswordField id="password" autoComplete="new-password" placeholder="Create a new password" disabled={isSubmitting} invalid={Boolean(errors.password)} registration={register('password')}/>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <PasswordField id="confirmPassword" autoComplete="new-password" placeholder="Confirm your new password" disabled={isSubmitting} invalid={Boolean(errors.confirmPassword)} registration={register('confirmPassword')}/>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (<>
                <Loader2 className="animate-spin"/>
                Resetting password
              </>) : ('Reset password')}
          </Button>
          <Button asChild className="w-full" type="button" variant="ghost">
            <Link to="/login">Return to sign in</Link>
          </Button>
        </form>
      </CardContent>
    </Card>);
}
