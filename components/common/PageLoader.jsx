import { Loader2 } from 'lucide-react';

export function PageLoader() {
    return (
        <div className="flex min-h-64 items-center justify-center" role="status" aria-label="Loading">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}
