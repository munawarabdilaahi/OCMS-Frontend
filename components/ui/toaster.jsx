import { Toaster as SonnerToaster } from 'sonner';
export function Toaster() {
    return (<SonnerToaster richColors closeButton position="top-right" toastOptions={{
            classNames: {
                toast: 'border bg-popover text-popover-foreground',
                title: 'text-sm font-medium',
                description: 'text-sm text-muted-foreground',
            },
        }}/>);
}
