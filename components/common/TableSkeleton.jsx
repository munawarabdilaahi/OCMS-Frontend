function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 px-4 py-3">
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>
    );
}

export function TableSkeleton({ rows = 5, columns = 7 }) {
    const widths = [80, 100, 120, 70, 60, 90, 70];
    return (
        <div className="rounded-lg border bg-card">
            <div className="border-b px-4 py-3">
                <div className="flex gap-16">
                    {Array.from({ length: columns }).map((_, i) => (
                        <div
                            key={i}
                            className="h-4 animate-pulse rounded bg-muted"
                            style={{ width: widths[i] || 80 }}
                        />
                    ))}
                </div>
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <SkeletonRow key={i} />
            ))}
        </div>
    );
}
