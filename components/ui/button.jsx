/* eslint-disable react-refresh/only-export-components */
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';
const buttonVariants = cva('inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border bg-background hover:bg-secondary hover:text-secondary-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-secondary hover:text-secondary-foreground',
            link: 'h-auto px-0 text-primary underline-offset-4 hover:underline',
        },
        size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-8 rounded-md px-3 text-xs',
            lg: 'h-11 rounded-md px-6',
            icon: 'size-10 p-0',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});
export function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props}/>;
}
export { buttonVariants };
