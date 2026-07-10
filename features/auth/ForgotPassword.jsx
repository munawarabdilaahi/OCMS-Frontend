import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MailCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from '@/lib/router';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordRequest } from '@/services/auth.service';
const schema = z.object({
    email: z.string().email('Enter the email linked to your OCMS account.'),
});
export function ForgotPassword() {
    const [submitError, setSubmitError] = useState('');
    const [submittedEmail, setSubmittedEmail] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: '' },
    });
    async function onSubmit(values) {
        setSubmitError('');
        setSubmittedEmail('');
        try {
            await forgotPasswordRequest(values);
            setSubmittedEmail(values.email);
        }
        catch (error) {
            setSubmitError(error.message || 'Unable to prepare reset instructions.');
        }
    }
    return (<Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-0 sm:px-6">
        <div className="mb-3 flex size-11 items-center justify-center rounded-md bg-primary/15 text-emerald-700 dark:text-teal-200">
          <MailCheck className="size-5"/>
        </div>
        <CardTitle className="text-2xl">Recover your account</CardTitle>
        <CardDescription>Enter your email address to prepare a password reset request.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {submitError && (<Alert variant="destructive">
              <AlertTitle>Request failed</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>)}
          {submittedEmail && (<Alert variant="success">
              <AlertTitle>Reset request prepared</AlertTitle>
              <AlertDescription>If an account exists for {submittedEmail}, reset instructions will be sent.</AlertDescription>
            </Alert>)}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="name@ocms.edu" disabled={isSubmitting} aria-invalid={Boolean(errors.email)} {...register('email')}/>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (<>
                <Loader2 className="animate-spin"/>
                Preparing request
              </>) : ('Continue')}
          </Button>
          <Button asChild className="w-full" type="button" variant="ghost">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </form>
      </CardContent>
    </Card>);
}
