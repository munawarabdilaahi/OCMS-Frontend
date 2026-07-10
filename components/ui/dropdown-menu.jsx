/* eslint-disable react-refresh/only-export-components */
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/cn';
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export function DropdownMenuContent({ className, sideOffset = 8, ...props }) {
    return (<DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content sideOffset={sideOffset} className={cn('z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2', className)} {...props}/>
    </DropdownMenuPrimitive.Portal>);
}
export function DropdownMenuItem({ className, inset, ...props }) {
    return (<DropdownMenuPrimitive.Item className={cn('relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', inset && 'pl-8', className)} {...props}/>);
}
// 1. KANI WAA KII KA MAQNAA EE CILADDA KEENAYEY (DropdownMenuLabel)
export function DropdownMenuLabel({ className, inset, ...props }) {
    return (<DropdownMenuPrimitive.Label className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)} {...props}/>);
}
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
