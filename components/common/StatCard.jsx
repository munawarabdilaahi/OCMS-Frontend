import { cn } from '@/lib/cn';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StatCard({ label, value, icon: Icon, color, loading, className }) {
    return (
        <Card className={cn('group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5', className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                {Icon && (
                    <span className={cn(
                        'flex size-9 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-accent/50',
                        color
                    )}>
                        <Icon className="size-[18px]" />
                    </span>
                )}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-24" />
                ) : (
                    <p className="text-2xl font-bold tabular-nums tracking-tight">
                        {value !== null && value !== undefined ? value.toLocaleString() : '\u2014'}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
