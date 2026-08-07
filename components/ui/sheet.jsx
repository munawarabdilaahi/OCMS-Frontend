/* eslint-disable react-refresh/only-export-components */
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

export function SheetOverlay({ className, ...props }) {
    return (
        <DialogPrimitive.Overlay
            className={cn('fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)}
            {...props}
        />
    );
}

export function SheetContent({ className, children, side = 'left', ...props }) {
    const sideStyles = {
        left: 'left-0 top-0 h-full w-3/4 max-w-sm',
        right: 'right-0 top-0 h-full w-3/4 max-w-sm',
        top: 'top-0 left-0 right-0',
        bottom: 'bottom-0 left-0 right-0',
    };
    return (
        <SheetPortal>
            <SheetOverlay />
            <DialogPrimitive.Content
                className={cn(
                    'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
                    sideStyles[side],
                    className
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring">
                    <X className="size-4" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </SheetPortal>
    );
}
