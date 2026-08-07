import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SortButton({ column, children }) {
    return (
        <Button
            type="button"
            variant="ghost"
            className="-ml-3 h-8 px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {children}
            <ArrowUpDown className="ml-1 size-3.5" />
        </Button>
    );
}
