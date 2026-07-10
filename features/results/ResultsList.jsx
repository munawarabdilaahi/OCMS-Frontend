/* eslint-disable react-hooks/incompatible-library, react-refresh/only-export-components */
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, Download, Eye, GraduationCap, MoreHorizontal, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from '@/lib/router';
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
export const resultCourses = [
    'Introduction to Programming',
    'Financial Accounting',
    'Structural Analysis',
    'Clinical Foundations',
    'Curriculum Design',
    'Quantum Mechanics',
];
export const defaultResults = [
    { studentId: 'STU-2026-001', studentName: 'Amina Hassan', course: 'Introduction to Programming', marks: 92, grade: 'A', gpa: 4.0 },
    { studentId: 'STU-2026-001', studentName: 'Amina Hassan', course: 'Financial Accounting', marks: 84, grade: 'B+', gpa: 3.4 },
    { studentId: 'STU-2026-001', studentName: 'Amina Hassan', course: 'Clinical Foundations', marks: 88, grade: 'A-', gpa: 3.7 },
    { studentId: 'STU-2026-002', studentName: 'Daniel Okafor', course: 'Financial Accounting', marks: 79, grade: 'B', gpa: 3.0 },
    { studentId: 'STU-2026-002', studentName: 'Daniel Okafor', course: 'Curriculum Design', marks: 73, grade: 'C+', gpa: 2.4 },
    { studentId: 'STU-2026-003', studentName: 'Leila Mohamed', course: 'Clinical Foundations', marks: 91, grade: 'A', gpa: 4.0 },
    { studentId: 'STU-2026-003', studentName: 'Leila Mohamed', course: 'Quantum Mechanics', marks: 69, grade: 'C', gpa: 2.0 },
    { studentId: 'STU-2026-004', studentName: 'Mateo Rivera', course: 'Structural Analysis', marks: 86, grade: 'A-', gpa: 3.7 },
    { studentId: 'STU-2026-005', studentName: 'Grace Kimani', course: 'Curriculum Design', marks: 95, grade: 'A', gpa: 4.0 },
    { studentId: 'STU-2026-006', studentName: 'Noah Bennett', course: 'Introduction to Programming', marks: 81, grade: 'B+', gpa: 3.4 },
    { studentId: 'STU-2026-007', studentName: 'Sara Patel', course: 'Financial Accounting', marks: 89, grade: 'A-', gpa: 3.7 },
    { studentId: 'STU-2026-008', studentName: 'Omar Farah', course: 'Structural Analysis', marks: 76, grade: 'B', gpa: 3.0 },
];
const gradeStyles = {
    A: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    'A-': 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
    'B+': 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    B: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    'C+': 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    C: 'bg-orange-500/10 text-orange-700 dark:text-orange-300',
};
export function getResults() {
    return defaultResults;
}
export function getStudentResults(studentId) {
    return getResults().filter((result) => result.studentId === studentId);
}
export function getStudentResultSummary(studentId) {
    const results = getStudentResults(studentId);
    const averageGpa = results.length ? results.reduce((sum, result) => sum + result.gpa, 0) / results.length : 0;
    const averageMarks = results.length ? Math.round(results.reduce((sum, result) => sum + result.marks, 0) / results.length) : 0;
    return {
        student: results[0],
        results,
        averageGpa,
        averageMarks,
        gradeDistribution: Object.entries(results.reduce((distribution, result) => {
            distribution[result.grade] = (distribution[result.grade] ?? 0) + 1;
            return distribution;
        }, {})).map(([grade, count]) => ({ grade, count })),
        performance: results.map((result) => ({
            course: result.course,
            marks: result.marks,
            gpa: result.gpa,
        })),
    };
}
function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}
function exportResults(rows) {
    const headers = ['Student ID', 'Student Name', 'Course', 'Marks', 'Grade', 'GPA'];
    const body = rows.map((row) => {
        const result = row.original;
        return [result.studentId, result.studentName, result.course, result.marks, result.grade, result.gpa];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-results.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}
function ResultsDataTable({ data, initialCourse, isStudent = false }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState(() => (initialCourse ? [{ id: 'course', value: initialCourse }] : []));
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
            accessorKey: 'marks',
            header: ({ column }) => <SortButton column={column}>Marks</SortButton>,
        },
        {
            accessorKey: 'grade',
            header: 'Grade',
            cell: ({ row }) => <Badge className={cn('whitespace-nowrap', gradeStyles[row.original.grade])}>{row.original.grade}</Badge>,
        },
        {
            accessorKey: 'gpa',
            header: ({ column }) => <SortButton column={column}>GPA</SortButton>,
            cell: ({ row }) => Number(row.original.gpa).toFixed(1),
        },
        {
            id: 'actions',
            header: 'Actions',
            enableHiding: false,
            cell: ({ row }) => (<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon">
                <MoreHorizontal />
                <span className="sr-only">Open result actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/results/${row.original.studentId}`}>
                  <Eye />
                  {isStudent ? 'View My Details' : 'View Student Details'}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>),
        },
    ], [isStudent]);
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
        <div className="grid gap-3 sm:grid-cols-[minmax(0,320px)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
            <Input className="pl-9" placeholder="Search results..." value={globalFilter ?? ''} onChange={(event) => setGlobalFilter(event.target.value)}/>
          </div>
          <Select value={table.getColumn('course')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('course')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Course"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {resultCourses.map((course) => (<SelectItem key={course} value={course}>
                  {course}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <Button type="button" variant="outline" onClick={() => exportResults(table.getFilteredRowModel().rows)}>
          <Download />
          Export
        </Button>
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
                  No results found.
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
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
export function ResultsList() {
    const { user } = useAuth();
    const isStudent = user?.role === ROLES.STUDENT;
    const [searchParams] = useSearchParams();
    const course = searchParams.get('course');
    const results = isStudent ? getStudentResults(user.studentId) : getResults();
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {isStudent ? 'My Results' : 'Results'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isStudent
            ? 'Review your own marks, grades, and GPA values.'
            : 'Review marks, grades, GPA values, and student result details.'}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <GraduationCap className="size-5"/>
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isStudent ? 'My Course Results' : 'Student Results'}</CardTitle>
          <CardDescription>
            {isStudent
            ? 'Search, filter by course, and open your performance details.'
            : 'Search, filter by course, export, and open student performance details.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResultsDataTable data={results} initialCourse={course} isStudent={isStudent}/>
        </CardContent>
      </Card>
    </div>);
}
