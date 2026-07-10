import { cn } from '@/lib/cn';
export function Textarea({ className, ...props }) {
    return (<textarea className={cn('flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50', className)} {...props}/>);
}
