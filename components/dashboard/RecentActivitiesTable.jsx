import { Inbox } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { cn } from '@/lib/cn';
import { ACTIVITY_STATUS_STYLES as statusStyles } from '@/lib/status-styles';

export function RecentActivitiesTable({ activities }) {
    return (<Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base">Recent Activities</CardTitle>
          <CardDescription>Latest academic, finance, and operations events.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {(!activities || activities.length === 0) ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <Inbox className="size-8 text-muted-foreground/50" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No recent activities to display.</p>
          </div>
        ) : (
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
            {activities.map((activity) => (<TableRow key={activity.id} className="transition-colors hover:bg-accent/50">
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
        )}
      </CardContent>
    </Card>);
}
