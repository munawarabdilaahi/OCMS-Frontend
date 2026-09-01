import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function ErrorAlert({ title = 'Error', message, onRetry }) {
    return (
        <Alert variant="destructive">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                <span>{message}</span>
                {onRetry && (
                    <Button type="button" variant="outline" size="sm" className="ml-4" onClick={onRetry}>
                        <RefreshCw className="mr-1 size-3.5" />
                        Retry
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}
