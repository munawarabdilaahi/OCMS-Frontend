import { Button } from '@/components/ui/button';
import { Link } from '@/lib/router';

export function PageHeader({ title, description, actionLabel, actionTo, loading }) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">{title}</h1>
                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {loading ? 'Loading...' : description}
                    </p>
                )}
            </div>
            {actionLabel && actionTo && (
                <div className="flex gap-2">
                    <Button asChild>
                        <Link to={actionTo}>{actionLabel}</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
