/* eslint-disable react-hooks/incompatible-library, react-refresh/only-export-components */
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, CalendarCheck, Clock3, Download, FileBarChart, MoreHorizontal, Plus, Search, UserCheck, UserMinus, UserRoundCheck, } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { ROLES } from '@/lib/roles';
export const attendanceStatuses = ['Present', 'Absent', 'Late'];
export const attendanceCourses = [
    'Introduction to Programming',
    'Financial Accounting',
    'Structural Analysis',
    'Clinical Foundations',
    'Curriculum Design',
    'Quantum Mechanics',
];
export const attendanceStudents = [
    { id: 'STU-2026-001', name: 'Amina Hassan' },
    { id: 'STU-2026-002', name: 'Daniel Okafor' },
    { id: 'STU-2026-003', name: 'Leila Mohamed' },
    { id: 'STU-2026-004', name: 'Mateo Rivera' },
    { id: 'STU-2026-005', name: 'Grace Kimani' },
    { id: 'STU-2026-006', name: 'Noah Bennett' },
    { id: 'STU-2026-007', name: 'Sara Patel' },
    { id: 'STU-2026-008', name: 'Omar Farah' },
];
export const defaultAttendanceRecords = [
    {
        id: 'ATT-001',
        studentId: 'STU-2026-001',
        studentName: 'Amina Hassan',
        course: 'Introduction to Programming',
        date: '2026-06-01',
        status: 'Present',
    },
    {
        id: 'ATT-002',
        studentId: 'STU-2026-006',
        studentName: 'Noah Bennett',
        course: 'Introduction to Programming',
        date: '2026-06-01',
        status: 'Late',
    },
    {
        id: 'ATT-003',
        studentId: 'STU-2026-002',
        studentName: 'Daniel Okafor',
        course: 'Financial Accounting',
        date: '2026-06-02',
        status: 'Present',
    },
    {
        id: 'ATT-004',
        studentId: 'STU-2026-007',
        studentName: 'Sara Patel',
        course: 'Financial Accounting',
        date: '2026-06-02',
        status: 'Absent',
    },
    {
        id: 'ATT-005',
        studentId: 'STU-2026-004',
        studentName: 'Mateo Rivera',
        course: 'Structural Analysis',
        date: '2026-06-03',
        status: 'Present',
    },
    {
        id: 'ATT-006',
        studentId: 'STU-2026-008',
        studentName: 'Omar Farah',
        course: 'Structural Analysis',
        date: '2026-06-03',
        status: 'Present',
    },
    {
        id: 'ATT-007',
        studentId: 'STU-2026-003',
        studentName: 'Leila Mohamed',
        course: 'Clinical Foundations',
        date: '2026-06-04',
        status: 'Late',
    },
    {
        id: 'ATT-008',
        studentId: 'STU-2026-005',
        studentName: 'Grace Kimani',
        course: 'Curriculum Design',
        date: '2026-06-05',
        status: 'Present',
    },
    {
        id: 'ATT-009',
        studentId: 'STU-2026-001',
        studentName: 'Amina Hassan',
        course: 'Introduction to Programming',
        date: '2026-06-08',
        status: 'Absent',
    },
    {
        id: 'ATT-010',
        studentId: 'STU-2026-006',
        studentName: 'Noah Bennett',
        course: 'Introduction to Programming',
        date: '2026-06-08',
        status: 'Present',
    },
];
export const monthlyAttendanceTrend = [
    { month: 'Jan', rate: 82 },
    { month: 'Feb', rate: 84 },
    { month: 'Mar', rate: 87 },
    { month: 'Apr', rate: 85 },
    { month: 'May', rate: 89 },
    { month: 'Jun', rate: 86 },
    { month: 'Jul', rate: 91 },
    { month: 'Aug', rate: 90 },
    { month: 'Sep', rate: 93 },
    { month: 'Oct', rate: 92 },
    { month: 'Nov', rate: 94 },
    { month: 'Dec', rate: 95 },
];
const storageKey = 'ocms-attendance';
const statusStyles = {
    Present: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Absent: 'bg-destructive/10 text-destructive',
    Late: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
};
function readStoredAttendance() {
    if (typeof window === 'undefined') {
        return defaultAttendanceRecords;
    }
    try {
        const storedRecords = window.localStorage.getItem(storageKey);
        return storedRecords ? JSON.parse(storedRecords) : defaultAttendanceRecords;
    }
    catch {
        return defaultAttendanceRecords;
    }
}
export function getAttendanceRecords() {
    return readStoredAttendance();
}
export function getAttendanceRecordsByStudentId(studentId) {
    return getAttendanceRecords().filter((record) => record.studentId === studentId);
}
export function saveAttendanceRecords(records) {
    const nextRecords = [...records, ...getAttendanceRecords()];
    window.localStorage.setItem(storageKey, JSON.stringify(nextRecords));
    return nextRecords;
}
export function getAttendanceStats(records = getAttendanceRecords()) {
    const present = records.filter((record) => record.status === 'Present').length;
    const absent = records.filter((record) => record.status === 'Absent').length;
    const late = records.filter((record) => record.status === 'Late').length;
    const rate = records.length ? Math.round(((present + late * 0.5) / records.length) * 100) : 0;
    return {
        rate,
        present,
        absent,
        late,
        total: records.length,
    };
}
function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}
function exportAttendance(rows) {
    const headers = ['Student ID', 'Student Name', 'Course', 'Date', 'Status'];
    const body = rows.map((row) => {
        const record = row.original;
        return [record.studentId, record.studentName, record.course, record.date, record.status];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-attendance.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}
function AttendanceTooltip({ active, payload, label }) {
    if (!active || !payload?.length) {
        return null;
    }
    return (<div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      <p className="text-muted-foreground">
        Attendance Rate: <span className="font-medium text-foreground">{payload[0].value}%</span>
      </p>
    </div>);
}
export function AttendanceTrendChart({ data = monthlyAttendanceTrend }) {
    return (<Card>
      <CardHeader>
        <CardTitle>Monthly Attendance Trends</CardTitle>
        <CardDescription>Attendance rate movement across the academic year.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="attendanceTrend" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.32}/>
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border))"/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={12} stroke="rgb(var(--muted-foreground))" fontSize={12}/>
              <YAxis axisLine={false} tickLine={false} tickMargin={10} width={42} domain={[0, 100]} stroke="rgb(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value}%`}/>
              <Tooltip cursor={{ stroke: '#0f766e', strokeOpacity: 0.18, strokeWidth: 2 }} content={<AttendanceTooltip />}/>
              <Area type="monotone" dataKey="rate" name="Attendance Rate" stroke="#0f766e" strokeWidth={2.5} fill="url(#attendanceTrend)" activeDot={{ r: 5, fill: '#0f766e', stroke: 'rgb(var(--background))', strokeWidth: 2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>);
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
            cell: ({ row }) => (<Badge className={cn('whitespace-nowrap', statusStyles[row.original.status])}>{row.original.status}</Badge>),
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
              {attendanceCourses.map((course) => (<SelectItem key={course} value={course}>
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
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No attendance records found.
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
    const [records] = useState(() => (isStudent ? getAttendanceRecordsByStudentId(user.studentId) : getAttendanceRecords()));
    const stats = getAttendanceStats(records);
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
      <AttendanceTrendChart />

      <Alert>
        <AlertTitle>Mock attendance workspace</AlertTitle>
        <AlertDescription>Attendance records are stored in browser localStorage until backend integration.</AlertDescription>
      </Alert>

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
