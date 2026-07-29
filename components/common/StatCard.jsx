import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatCard({ label, value, icon: Icon, color, loading }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                {Icon && <Icon className={`size-5 ${color || ''}`} />}
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{loading ? '\u2014' : (value ?? 0).toLocaleString()}</p>
            </CardContent>
        </Card>
    );
}
