import { StatCard } from '@/components/common/StatCard';

export function StatsGrid({ items, loading }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
                <StatCard key={item.label} {...item} loading={loading} />
            ))}
        </div>
    );
}
