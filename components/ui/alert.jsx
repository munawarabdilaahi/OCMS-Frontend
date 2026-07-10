import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/cn';
const icons = {
    default: AlertCircle,
    destructive: AlertCircle,
    success: CheckCircle2,
};
export function Alert({ className, variant = 'default', ...props }) {
    const Icon = icons[variant] ?? icons.default;
    return (<div role="alert" className={cn('relative grid w-full grid-cols-[1rem_1fr] gap-3 rounded-md border p-4 text-sm', variant === 'destructive' && 'border-destructive/40 bg-destructive/10 text-destructive', variant === 'success' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', variant === 'default' && 'bg-secondary text-secondary-foreground', className)} {...props}>
      <Icon className="mt-0.5 size-4"/>
      <div>{props.children}</div>
    </div>);
}
export function AlertTitle({ className, ...props }) {
    return <h5 className={cn('mb-1 font-medium leading-none tracking-normal', className)} {...props}/>;
}
export function AlertDescription({ className, ...props }) {
    return <div className={cn('text-sm leading-5 opacity-90', className)} {...props}/>;
}
