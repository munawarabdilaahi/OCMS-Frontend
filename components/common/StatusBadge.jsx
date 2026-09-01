import { Badge } from '@/components/ui/badge';
import { getStatusStyle } from '@/lib/status-styles';

export function StatusBadge({ status, styles }) {
    return (
        <Badge className={`${getStatusStyle(status, styles)} border-0`} variant="outline">
            {status}
        </Badge>
    );
}
