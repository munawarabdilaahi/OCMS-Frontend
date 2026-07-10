/* eslint-disable react-refresh/only-export-components */
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export function SelectTrigger({ className, children, ...props }) {
    return (<SelectPrimitive.Trigger className={cn('flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50', className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 opacity-50"/>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>);
}
export function SelectContent({ className, children, ...props }) {
    return (<SelectPrimitive.Portal>
      <SelectPrimitive.Content className={cn('z-50 min-w-36 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md', className)} {...props}>
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>);
}
export function SelectItem({ className, children, ...props }) {
    return (<SelectPrimitive.Item className={cn('relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-secondary', className)} {...props}>
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4"/>
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>);
}
