import { useState } from 'react';
import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { AttendanceDashboardCards } from '@/features/attendance/AttendanceList';
import { ROLES } from '@/lib/roles';
export function AttendanceReport() {
    const { user } = useAuth();
    const isStudent = user?.role === ROLES.STUDENT;
    const [records] = useState([]);
    const stats = { rate: 0, present: 0, absent: 0, late: 0, total: 0 };
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {isStudent ? 'My Attendance Report' : 'Attendance Report'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isStudent
            ? 'Review your attendance summary by course and date.'
            : 'Review attendance summaries by course, date, and student search terms.'}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/attendance">
            Attendance List
          </Link>
        </Button>
      </div>

      <AttendanceDashboardCards stats={stats}/>

      <Card>
        <CardHeader>
          <CardTitle>Report Records</CardTitle>
          <CardDescription>Attendance report data will appear once the backend is connected.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!records.length && (<TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No attendance records available.
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>);
}
