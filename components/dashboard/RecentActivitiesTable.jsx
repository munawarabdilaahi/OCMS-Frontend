import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { cn } from '@/lib/cn';
const statusStyles = {
    Completed: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Review: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    'In Progress': 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
};
export function RecentActivitiesTable({ activities }) {
    return (<Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base">Recent Activities</CardTitle>
          <CardDescription>Latest academic, finance, and operations events.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead className="hidden md:table-cell">Module</TableHead>
              <TableHead className="hidden lg:table-cell">Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (<TableRow key={activity.id}>
                <TableCell>
                  <div className="min-w-52">
                    <p className="font-medium">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground">{activity.id}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{activity.module}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{activity.owner}</TableCell>
                <TableCell>
                  <Badge className={cn('whitespace-nowrap', statusStyles[activity.status])}>{activity.status}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-right text-muted-foreground">{activity.time}</TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>);
}
