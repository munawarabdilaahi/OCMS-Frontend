import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, CalendarCheck, Clock3, Download, FileBarChart, MoreHorizontal, Plus, Search, UserCheck, UserMinus, UserRoundCheck, } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { ROLES } from '@/lib/roles';
export const attendanceStatuses = ['Present', 'Absent', 'Late'];
const statusStyles = {
    Present: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Absent: 'bg-destructive/10 text-destructive',
    Late: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
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
        const record = row.original;
        return [record.studentId, record.studentName, record.course, record.date, record.status];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-attendance.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}
function AttendanceSummaryCard({ title, value, description, icon: Icon, tone }) {
    const toneClasses = {
        teal: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
        emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        rose: 'bg-destructive/10 text-destructive',
        amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    };
    return (<Card>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-2 text-2xl">{value}</CardTitle>
        </div>
        <span className={cn('flex size-10 items-center justify-center rounded-md', toneClasses[tone])}>
          <Icon className="size-5"/>
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>);
}
export function AttendanceDashboardCards({ stats }) {
    return (<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <AttendanceSummaryCard title="Attendance Rate" value={`${stats.rate}%`} description={`${stats.total} attendance records tracked`} icon={CalendarCheck} tone="teal"/>
      <AttendanceSummaryCard title="Present Students" value={stats.present} description="Marked present for selected records" icon={UserCheck} tone="emerald"/>
      <AttendanceSummaryCard title="Absent Students" value={stats.absent} description="Marked absent for selected records" icon={UserMinus} tone="rose"/>
      <AttendanceSummaryCard title="Late Students" value={stats.late} description="Arrived after scheduled start" icon={Clock3} tone="amber"/>
    </div>);
}
function AttendanceDataTable({ data, isStudent = false }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'studentId',
            header: ({ column }) => <SortButton column={column}>Student ID</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.studentId}</span>,
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
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (<Badge className={cn('whitespace-nowrap', statusStyles[row.original.status] || '')}>{row.original.status}</Badge>),
        },
        {
            id: 'actions',
            header: 'Actions',
            enableHiding: false,
            cell: ({ row }) => (<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon">
                <MoreHorizontal />
                <span className="sr-only">Open row actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/attendance/report?course=${encodeURIComponent(row.original.course)}&date=${row.original.date}`}>
                  <FileBarChart />
                  View Report
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>),
        },
    ], []);
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return (<div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,320px)_220px_170px]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
            <Input className="pl-9" placeholder="Search attendance..." value={globalFilter ?? ''} onChange={(event) => setGlobalFilter(event.target.value)}/>
          </div>
          <Select value={table.getColumn('course')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('course')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Course"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {[...new Set(data.map((r) => r.course).filter(Boolean))].map((course) => (<SelectItem key={course} value={course}>
                  {course}
                </SelectItem>))}
            </SelectContent>
          </Select>
          <Input type="date" value={table.getColumn('date')?.getFilterValue() ?? ''} onChange={(event) => table.getColumn('date')?.setFilterValue(event.target.value || undefined)}/>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => exportAttendance(table.getFilteredRowModel().rows)}>
            <Download />
            Export Attendance
          </Button>
          <Button asChild variant="outline">
            <Link to="/attendance/report">
              <FileBarChart />
              Report
            </Link>
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
                  <EmptyState title="No attendance records found" description="Attendance records will appear once the backend is connected." actionLabel={isStudent ? undefined : 'Take Attendance'} actionTo={isStudent ? undefined : '/attendance/take'}/>
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
          <Button type="button" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <Button type="button" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>);
}
export function AttendanceList() {
    const { user } = useAuth();
    const isStudent = user?.role === ROLES.STUDENT;
    const [records] = useState([]);
    const stats = { rate: 0, present: 0, absent: 0, late: 0, total: 0 };
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {isStudent ? 'My Attendance' : 'Attendance'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isStudent
            ? 'Review your own attendance records by course, class date, and status.'
            : 'Track student attendance by course, class date, and attendance status.'}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <UserRoundCheck className="size-5"/>
        </span>
      </div>

      <AttendanceDashboardCards stats={stats}/>

      <Card>
        <CardHeader>
          <CardTitle>{isStudent ? 'My Attendance Records' : 'Attendance Records'}</CardTitle>
          <CardDescription>
            {isStudent
            ? 'Search, filter by course or date, and review your attendance entries.'
            : 'Search, filter by course or date, export, and review attendance entries.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceDataTable data={records} isStudent={isStudent}/>
        </CardContent>
      </Card>
    </div>);
}
