import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, CalendarCheck, Clock3, Download, FileBarChart, MoreHorizontal, Plus, Search, UserCheck, UserMinus, UserRoundCheck, } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { ROLES } from '@/lib/roles';
import { getAttendance, getAttendanceStats } from '@/services/attendance.service';

const statusStyles = {
    PRESENT: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    ABSENT: 'bg-destructive/10 text-destructive',
    LATE: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
};

function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}

function exportAttendance(rows) {
    if (!rows.length) return;
    const headers = ['Student ID', 'Student Name', 'Course', 'Date', 'Status'];
    const body = rows.map((row) => {
        const r = row.original;
        return [r.student_id, r.studentName, r.course, r.date?.split('T')[0], r.status];
    });
    const csv = [headers, ...body].map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-attendance.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}

function AttendanceDashboardCards({ stats }) {
    return (<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Attendance Rate</CardDescription>
            <CardTitle className="mt-2 text-2xl">{stats?.rate ?? 0}%</CardTitle>
          </div>
          <span className="flex size-10 items-center justify-center rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300">
            <CalendarCheck className="size-5"/>
          </span>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{stats?.total ?? 0} records tracked</p></CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Present</CardDescription>
            <CardTitle className="mt-2 text-2xl">{stats?.present ?? 0}</CardTitle>
          </div>
          <span className="flex size-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <UserCheck className="size-5"/>
          </span>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Marked present</p></CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Absent</CardDescription>
            <CardTitle className="mt-2 text-2xl">{stats?.absent ?? 0}</CardTitle>
          </div>
          <span className="flex size-10 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <UserMinus className="size-5"/>
          </span>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Marked absent</p></CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Late</CardDescription>
            <CardTitle className="mt-2 text-2xl">{stats?.late ?? 0}</CardTitle>
          </div>
          <span className="flex size-10 items-center justify-center rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300">
            <Clock3 className="size-5"/>
          </span>
        </CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Arrived late</p></CardContent>
      </Card>
    </div>);
}

function AttendanceDataTable({ data, isStudent = false }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const columns = useMemo(() => [
        {
            accessorKey: 'student_id',
            header: ({ column }) => <SortButton column={column}>Student ID</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.student_id}</span>,
        },
        {
            accessorKey: 'studentName',
            header: ({ column }) => <SortButton column={column}>Student Name</SortButton>,
        },
        {
            accessorKey: 'course',
            header: ({ column }) => <SortButton column={column}>Course</SortButton>,
        },
        {
            accessorKey: 'date',
            header: ({ column }) => <SortButton column={column}>Date</SortButton>,
            cell: ({ row }) => row.original.date ? new Date(row.original.date).toLocaleDateString() : '-',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (<Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status}</Badge>),
        },
        {
            accessorKey: 'remarks',
            header: 'Remarks',
            cell: ({ row }) => row.original.remarks || '-',
        },
    ], []);

    const table = useReactTable({
        data, columns,
        state: { sorting, globalFilter },
        initialState: { pagination: { pageSize: 10 } },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (<div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
          <Input className="pl-9" placeholder="Search attendance..." value={globalFilter ?? ''} onChange={(event) => setGlobalFilter(event.target.value)}/>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => exportAttendance(table.getFilteredRowModel().rows)}>
            <Download />
            Export
          </Button>
          {!isStudent && (<Button asChild>
              <Link to="/attendance/take">
                <Plus />
                Take Attendance
              </Link>
            </Button>)}
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (<TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (<TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>))}
              </TableRow>))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (table.getRowModel().rows.map((row) => (<TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}
                </TableRow>))) : (<TableRow>
                <TableCell colSpan={columns.length} className="p-6">
                  <EmptyState title="No attendance records found" description="Take attendance to get started." actionLabel={isStudent ? undefined : 'Take Attendance'} actionTo={isStudent ? undefined : '/attendance/take'}/>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} records
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
        </div>
      </div>
    </div>);
}

export function AttendanceList() {
    const { user } = useAuth();
    const isStudent = user?.role === ROLES.STUDENT;
    const [records, setRecords] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const params = isStudent && user?.studentId ? { student_id: user.studentId } : {};
        Promise.all([getAttendance(params), getAttendanceStats(params)])
            .then(([attendanceRes, statsData]) => {
                const data = attendanceRes?.data ?? [];
                setRecords(Array.isArray(data) ? data : []);
                setStats(statsData);
            })
            .catch(() => setError('Failed to load attendance data.'))
            .finally(() => setLoading(false));
    }, [isStudent, user?.studentId]);
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {isStudent ? 'My Attendance' : 'Attendance'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isStudent ? 'Review your own attendance records.' : 'Track student attendance by course, class date, and status.'}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <UserRoundCheck className="size-5"/>
        </span>
      </div>

      {error && (<Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>)}

      <AttendanceDashboardCards stats={stats}/>

      <Card>
        <CardHeader>
          <CardTitle>{isStudent ? 'My Attendance Records' : 'Attendance Records'}</CardTitle>
          <CardDescription>Search, filter, and review attendance entries.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading attendance...</p></div>
          ) : (
            <AttendanceDataTable data={records} isStudent={isStudent}/>
          )}
        </CardContent>
      </Card>
    </div>);
}
