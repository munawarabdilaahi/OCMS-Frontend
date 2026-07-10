/* eslint-disable react-hooks/incompatible-library, react-refresh/only-export-components */
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, ClipboardList, Download, MoreHorizontal, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { cn } from '@/lib/cn';
export const examCourses = [
    'Introduction to Programming',
    'Financial Accounting',
    'Structural Analysis',
    'Clinical Foundations',
    'Curriculum Design',
    'Quantum Mechanics',
];
export const examStatuses = ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'];
export const defaultExams = [
    {
        id: 'EXM-001',
        name: 'Programming Midterm',
        course: 'Introduction to Programming',
        date: '2026-07-12',
        totalMarks: 100,
        status: 'Scheduled',
    },
    {
        id: 'EXM-002',
        name: 'Accounting Quiz 2',
        course: 'Financial Accounting',
        date: '2026-06-28',
        totalMarks: 50,
        status: 'Completed',
    },
    {
        id: 'EXM-003',
        name: 'Structural Analysis Final',
        course: 'Structural Analysis',
        date: '2026-08-04',
        totalMarks: 100,
        status: 'Scheduled',
    },
    {
        id: 'EXM-004',
        name: 'Clinical Skills Assessment',
        course: 'Clinical Foundations',
        date: '2026-06-20',
        totalMarks: 80,
        status: 'Ongoing',
    },
    {
        id: 'EXM-005',
        name: 'Curriculum Design Portfolio',
        course: 'Curriculum Design',
        date: '2026-05-30',
        totalMarks: 100,
        status: 'Completed',
    },
    {
        id: 'EXM-006',
        name: 'Quantum Mechanics Retake',
        course: 'Quantum Mechanics',
        date: '2026-06-16',
        totalMarks: 70,
        status: 'Cancelled',
    },
];
const storageKey = 'ocms-exams';
const statusStyles = {
    Scheduled: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    Ongoing: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Completed: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Cancelled: 'bg-destructive/10 text-destructive',
};
function readStoredExams() {
    if (typeof window === 'undefined') {
        return defaultExams;
    }
    try {
        const storedExams = window.localStorage.getItem(storageKey);
        return storedExams ? JSON.parse(storedExams) : defaultExams;
    }
    catch {
        return defaultExams;
    }
}
export function getExams() {
    return readStoredExams();
}
export function saveExam(exam) {
    const nextExams = [{ id: `EXM-${Date.now()}`, ...exam }, ...getExams()];
    window.localStorage.setItem(storageKey, JSON.stringify(nextExams));
    return nextExams;
}
function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}
function exportExams(rows) {
    const headers = ['Exam Name', 'Course', 'Date', 'Total Marks', 'Status'];
    const body = rows.map((row) => {
        const exam = row.original;
        return [exam.name, exam.course, exam.date, exam.totalMarks, exam.status];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-exams.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}
function ExamsDataTable({ data }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: ({ column }) => <SortButton column={column}>Exam Name</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
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
            accessorKey: 'totalMarks',
            header: ({ column }) => <SortButton column={column}>Total Marks</SortButton>,
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
                <span className="sr-only">Open exam actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/results?course=${encodeURIComponent(row.original.course)}`}>View Results</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>),
        },
    ], []);
    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter, columnFilters },
        initialState: { pagination: { pageSize: 5 } },
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
            <Input className="pl-9" placeholder="Search exams..." value={globalFilter ?? ''} onChange={(event) => setGlobalFilter(event.target.value)}/>
          </div>
          <Select value={table.getColumn('course')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('course')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Course"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {examCourses.map((course) => (<SelectItem key={course} value={course}>
                  {course}
                </SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={table.getColumn('status')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {examStatuses.map((status) => (<SelectItem key={status} value={status}>
                  {status}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => exportExams(table.getFilteredRowModel().rows)}>
            <Download />
            Export
          </Button>
          <Button asChild>
            <Link to="/exams/add">
              <Plus />
              Add Exam
            </Link>
          </Button>
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
                  No exams found.
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} exams
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
export function ExamsList() {
    const [exams] = useState(() => getExams());
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Exams</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage exam schedules, course assessments, marks, and status.</p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ClipboardList className="size-5"/>
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Schedule</CardTitle>
          <CardDescription>Search, filter, export, and review course exams.</CardDescription>
        </CardHeader>
        <CardContent>
          <ExamsDataTable data={exams}/>
        </CardContent>
      </Card>
    </div>);
}
