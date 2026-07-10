/* eslint-disable react-hooks/incompatible-library */
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, MonitorCog, Palette, Save, ShieldCheck, UserCog } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
const phoneRegex = /^\+?[0-9\s().-]{7,20}$/;
const generalSchema = z.object({
    institutionName: z.string().trim().min(2, 'Institution name is required'),
    campusCode: z.string().trim().min(2, 'Campus code is required'),
    academicYear: z.string().trim().min(4, 'Academic year is required'),
    timezone: z.string().trim().min(2, 'Timezone is required'),
    supportEmail: z.string().trim().email('Enter a valid support email'),
    supportPhone: z.string().trim().regex(phoneRegex, 'Enter a valid phone number'),
    address: z.string().trim().min(5, 'Address is required'),
});
const accountSchema = z.object({
    name: z.string().trim().min(2, 'Name is required'),
    title: z.string().trim().min(2, 'Title is required'),
    phone: z.string().trim().regex(phoneRegex, 'Enter a valid phone number'),
    email: z.string().trim().email('Enter a valid email'),
    recoveryEmail: z.string().trim().email('Enter a valid recovery email'),
});
const securitySchema = z
    .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(8, 'Use at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your new password'),
    sessionTimeout: z.string().trim().min(1, 'Session timeout is required'),
})
    .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
const notificationsSchema = z.object({
    emailAlerts: z.boolean(),
    smsAlerts: z.boolean(),
    paymentAlerts: z.boolean(),
    attendanceAlerts: z.boolean(),
    digestFrequency: z.string().trim().min(1, 'Digest frequency is required'),
});
const appearanceSchema = z.object({
    theme: z.enum(['light', 'dark', 'system']),
    density: z.string().trim().min(1, 'Display density is required'),
    accentColor: z.string().trim().min(1, 'Accent color is required'),
});
function FieldError({ message }) {
    return message ? <p className="text-xs text-destructive">{message}</p> : null;
}
function FormActions({ isSubmitting }) {
    return (<div className="flex justify-end gap-2 pt-2">
      <Button type="reset" variant="outline">
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        <Save />
        Save Changes
      </Button>
    </div>);
}
function CheckboxField({ label, checked, onChange }) {
    return (<label className="flex items-center justify-between gap-4 rounded-md border p-3 text-sm">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-primary"/>
    </label>);
}
function TextField({ id, label, register, error, type = 'text', ...props }) {
    return (<div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} aria-invalid={Boolean(error)} {...register(id)} {...props}/>
      <FieldError message={error?.message}/>
    </div>);
}
function SettingsCard({ icon: Icon, title, description, children }) {
    return (<Card>
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <span className="grid size-10 place-items-center rounded-md bg-primary/15 text-primary">
          <Icon className="size-5"/>
        </span>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>);
}
export function Settings() {
    const { user, updateUser } = useAuth();
    const { theme, setTheme } = useTheme();
    const generalForm = useForm({
        resolver: zodResolver(generalSchema),
        defaultValues: {
            institutionName: 'Online Campus Management System',
            campusCode: 'OCMS-MAIN',
            academicYear: '2026',
            timezone: 'Africa/Nairobi',
            supportEmail: 'support@ocms.edu',
            supportPhone: '+254 700 000 000',
            address: 'Main Campus Administration Block',
        },
    });
    const accountForm = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: user?.name ?? '',
            title: user?.role ?? 'Administrator',
            phone: '+254 711 222 333',
            email: user?.email ?? '',
            recoveryEmail: user?.email ?? '',
        },
    });
    const securityForm = useForm({
        resolver: zodResolver(securitySchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            sessionTimeout: '30',
        },
    });
    const notificationsForm = useForm({
        resolver: zodResolver(notificationsSchema),
        defaultValues: {
            emailAlerts: true,
            smsAlerts: false,
            paymentAlerts: true,
            attendanceAlerts: true,
            digestFrequency: 'daily',
        },
    });
    const appearanceForm = useForm({
        resolver: zodResolver(appearanceSchema),
        defaultValues: {
            theme,
            density: 'comfortable',
            accentColor: 'emerald',
        },
    });
    const handleInvalid = () => toast.error('Please fix the highlighted fields before saving.');
    const save = (message, callback) => (values) => {
        callback?.(values);
        toast.success(message);
    };
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage profile, account security, notifications, appearance, and system defaults.
        </p>
      </div>

      <Tabs defaultValue="general" className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <TabsList className="h-auto flex-col items-stretch justify-start gap-1 bg-transparent p-0">
          {[
            ['general', 'General'],
            ['account', 'Account'],
            ['security', 'Security'],
            ['notifications', 'Notifications'],
            ['appearance', 'Appearance'],
        ].map(([value, label]) => (<TabsTrigger key={value} value={value} className="justify-start rounded-md border bg-card px-3 py-2">
              {label}
            </TabsTrigger>))}
        </TabsList>

        <div className="min-w-0">
          <TabsContent value="general" className="mt-0">
            <SettingsCard icon={MonitorCog} title="General Settings" description="Institution identity and system defaults.">
              <form className="grid gap-4" onSubmit={generalForm.handleSubmit(save('General settings saved.'), handleInvalid)} onReset={() => generalForm.reset()}>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField id="institutionName" label="Institution Name" register={generalForm.register} error={generalForm.formState.errors.institutionName}/>
                  <TextField id="campusCode" label="Campus Code" register={generalForm.register} error={generalForm.formState.errors.campusCode}/>
                  <TextField id="academicYear" label="Academic Year" register={generalForm.register} error={generalForm.formState.errors.academicYear}/>
                  <TextField id="timezone" label="Timezone" register={generalForm.register} error={generalForm.formState.errors.timezone}/>
                  <TextField id="supportEmail" label="Support Email" register={generalForm.register} error={generalForm.formState.errors.supportEmail}/>
                  <TextField id="supportPhone" label="Support Phone" register={generalForm.register} error={generalForm.formState.errors.supportPhone}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Campus Address</Label>
                  <Textarea id="address" aria-invalid={Boolean(generalForm.formState.errors.address)} {...generalForm.register('address')}/>
                  <FieldError message={generalForm.formState.errors.address?.message}/>
                </div>
                <FormActions isSubmitting={generalForm.formState.isSubmitting}/>
              </form>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="account" className="mt-0">
            <SettingsCard icon={UserCog} title="Account Settings" description="Update your profile, email, and recovery details.">
              <form className="grid gap-4" onSubmit={accountForm.handleSubmit(save('Profile and email updated.', (values) => updateUser({ name: values.name, email: values.email })), handleInvalid)} onReset={() => accountForm.reset()}>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField id="name" label="Full Name" register={accountForm.register} error={accountForm.formState.errors.name}/>
                  <TextField id="title" label="Role or Title" register={accountForm.register} error={accountForm.formState.errors.title}/>
                  <TextField id="phone" label="Phone" register={accountForm.register} error={accountForm.formState.errors.phone}/>
                  <TextField id="email" label="Email" type="email" register={accountForm.register} error={accountForm.formState.errors.email}/>
                  <TextField id="recoveryEmail" label="Recovery Email" type="email" register={accountForm.register} error={accountForm.formState.errors.recoveryEmail}/>
                </div>
                <FormActions isSubmitting={accountForm.formState.isSubmitting}/>
              </form>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <SettingsCard icon={ShieldCheck} title="Security Settings" description="Change password and session behavior.">
              <form className="grid gap-4" onSubmit={securityForm.handleSubmit(save('Password and security settings updated.', () => securityForm.reset({ ...securityForm.getValues(), currentPassword: '', newPassword: '', confirmPassword: '' })), handleInvalid)} onReset={() => securityForm.reset()}>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField id="currentPassword" label="Current Password" type="password" register={securityForm.register} error={securityForm.formState.errors.currentPassword}/>
                  <TextField id="newPassword" label="New Password" type="password" register={securityForm.register} error={securityForm.formState.errors.newPassword}/>
                  <TextField id="confirmPassword" label="Confirm Password" type="password" register={securityForm.register} error={securityForm.formState.errors.confirmPassword}/>
                  <TextField id="sessionTimeout" label="Session Timeout Minutes" type="number" register={securityForm.register} error={securityForm.formState.errors.sessionTimeout}/>
                </div>
                <FormActions isSubmitting={securityForm.formState.isSubmitting}/>
              </form>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <SettingsCard icon={Bell} title="Notification Settings" description="Choose alerts for academic and finance events.">
              <form className="grid gap-4" onSubmit={notificationsForm.handleSubmit(save('Notification settings saved.'), handleInvalid)} onReset={() => notificationsForm.reset()}>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
            ['emailAlerts', 'Email alerts'],
            ['smsAlerts', 'SMS alerts'],
            ['paymentAlerts', 'Payment alerts'],
            ['attendanceAlerts', 'Attendance alerts'],
        ].map(([name, label]) => (<CheckboxField key={name} label={label} checked={notificationsForm.watch(name)} onChange={(value) => notificationsForm.setValue(name, value, { shouldDirty: true })}/>))}
                </div>
                <div className="space-y-2">
                  <Label>Digest Frequency</Label>
                  <Select value={notificationsForm.watch('digestFrequency')} onValueChange={(value) => notificationsForm.setValue('digestFrequency', value, { shouldValidate: true })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Realtime</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FormActions isSubmitting={notificationsForm.formState.isSubmitting}/>
              </form>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="appearance" className="mt-0">
            <SettingsCard icon={Palette} title="Appearance Settings" description="Theme and display preferences.">
              <form className="grid gap-4" onSubmit={appearanceForm.handleSubmit(save('Theme settings saved.', (values) => setTheme(values.theme)), handleInvalid)} onReset={() => appearanceForm.reset()}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={appearanceForm.watch('theme')} onValueChange={(value) => appearanceForm.setValue('theme', value, { shouldValidate: true })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <TextField id="density" label="Density" register={appearanceForm.register} error={appearanceForm.formState.errors.density}/>
                  <TextField id="accentColor" label="Accent Color" register={appearanceForm.register} error={appearanceForm.formState.errors.accentColor}/>
                </div>
                <FormActions isSubmitting={appearanceForm.formState.isSubmitting}/>
              </form>
            </SettingsCard>
          </TabsContent>
        </div>
      </Tabs>
    </div>);
}
