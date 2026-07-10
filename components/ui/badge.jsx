import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';
const badgeVariants = cva('inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors', {
    variants: {
        variant: {
            default: 'bg-primary/15 text-emerald-700 dark:text-teal-200',
            secondary: 'bg-secondary text-secondary-foreground',
            outline: 'border text-foreground',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});
export function Badge({ className, variant, ...props }) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props}/>;
}
