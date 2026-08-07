import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';
const badgeVariants = cva('inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors', {
    variants: {
        variant: {
            default: 'bg-primary/15 text-emerald-700 dark:text-teal-200',
            secondary: 'bg-secondary text-secondary-foreground',
            outline: 'border text-foreground',
            success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
            warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
            danger: 'bg-destructive/10 text-destructive',
            info: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});
export function Badge({ className, variant, ...props }) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props}/>;
}
