/* eslint-disable react-refresh/only-export-components */
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/cn';
export const Tabs = TabsPrimitive.Root;
export function TabsList({ className, ...props }) {
    return (<TabsPrimitive.List className={cn('inline-flex h-10 items-center justify-center rounded-md bg-secondary p-1 text-muted-foreground', className)} {...props}/>);
}
export function TabsTrigger({ className, ...props }) {
    return (<TabsPrimitive.Trigger className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm', className)} {...props}/>);
}
export function TabsContent({ className, ...props }) {
    return (<TabsPrimitive.Content className={cn('mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)} {...props}/>);
}
