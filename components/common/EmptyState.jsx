import { Plus } from 'lucide-react';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
export function EmptyState({ title = 'No records found', description, actionLabel, actionTo, onAction }) {
    return (<div className="flex min-h-52 flex-col items-center justify-center rounded-md border border-dashed bg-muted/20 p-8 text-center">
      <div className="mb-4 grid size-16 place-items-center rounded-full bg-secondary">
        <svg aria-hidden="true" className="size-9 text-muted-foreground" viewBox="0 0 64 64" fill="none">
          <rect x="12" y="14" width="40" height="36" rx="6" stroke="currentColor" strokeWidth="3"/>
          <path d="M20 26h24M20 34h18M20 42h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="font-medium">{title}</p>
      {description ? <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {actionLabel ? (actionTo ? (<Button asChild className="mt-4" size="sm">
            <Link to={actionTo}>
              <Plus />
              {actionLabel}
            </Link>
          </Button>) : (<Button type="button" className="mt-4" size="sm" onClick={onAction}>
            <Plus />
            {actionLabel}
          </Button>)) : null}
    </div>);
}
