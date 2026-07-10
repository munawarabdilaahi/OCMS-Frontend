import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/cn';
const toneClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    sky: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    teal: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
};
export function MetricCard({ stat }) {
    const Icon = stat.icon;
    return (<Card className="overflow-hidden">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal">{stat.value}</p>
        </div>
        <span className={cn('flex size-10 items-center justify-center rounded-md', toneClasses[stat.tone])}>
          <Icon className="size-5"/>
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-300">
            <ArrowUpRight className="size-4"/>
            {stat.change}
          </span>
          <span className="text-muted-foreground">{stat.trend}</span>
        </div>
      </CardContent>
    </Card>);
}
