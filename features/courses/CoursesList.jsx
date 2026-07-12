import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, BookOpen, Download, Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { EmptyState } from '@/components/common/EmptyState';
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
export const courseSemesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Summer'];
export const courseStatuses = ['Active', 'Draft', 'Completed', 'Archived'];
const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Draft: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Completed: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    Archived: 'bg-muted text-muted-foreground',
};
function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}
function exportCourses(rows) {
    if (!rows.length) return;
    const headers = ['Course Code', 'Course Name', 'Credit Hours', 'Department', 'Teacher', 'Semester', 'Status'];
    const body = rows.map((row) => {
        const course = row.original;
        return [course.code, course.name, course.creditHours, course.department, course.teacher, course.semester, course.status];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-courses.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}
function CoursesDataTable({ data, isStudent = false }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState([]);
    const columns = useMemo(() => [
        {
            accessorKey: 'code',
            header: ({ column }) => <SortButton column={column}>Course Code</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.code}</span>,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => <SortButton column={column}>Course Name</SortButton>,
        },
        {
            accessorKey: 'creditHours',
            header: ({ column }) => <SortButton column={column}>Credit Hours</SortButton>,
        },
        {
            accessorKey: 'department',
            header: ({ column }) => <SortButton column={column}>Department</SortButton>,
        },
        {
            accessorKey: 'teacher',
            header: ({ column }) => <SortButton column={column}>Teacher</SortButton>,
        },
        {
            accessorKey: 'semester',
            header: ({ column }) => <SortButton column={column}>Semester</SortButton>,
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
                <Link to={`/courses/${row.original.code}`}>
                  <Eye />
                  View Details
                </Link>
              </DropdownMenuItem>
              {!isStudent && (<>
                  <DropdownMenuItem asChild>
                    <Link to={`/courses/${row.original.code}/edit`}>
                      <Pencil />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </>)}
            </DropdownMenuContent>
          </DropdownMenu>),
        },
    ], [isStudent]);
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,320px)_180px_160px_160px]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
            <Input className="pl-9" placeholder="Search courses..." value={globalFilter ?? ''} onChange={(event) => setGlobalFilter(event.target.value)}/>
          </div>
          <Select value={table.getColumn('department')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('department')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Department"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {[...new Set(data.map((c) => c.department).filter(Boolean))].map((department) => (<SelectItem key={department} value={department}>
                  {department}
                </SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={table.getColumn('semester')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('semester')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Semester"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {courseSemesters.map((semester) => (<SelectItem key={semester} value={semester}>
                  {semester}
                </SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={table.getColumn('status')?.getFilterValue() ?? 'all'} onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {courseStatuses.map((status) => (<SelectItem key={status} value={status}>
                  {status}
                </SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => exportCourses(table.getFilteredRowModel().rows)}>
            <Download />
            Export
          </Button>
          {!isStudent && (<Button asChild>
              <Link to="/courses/add">
                <Plus />
                Add Course
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
                  <EmptyState title="No courses found" description="Courses will be available once the backend is connected."/>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} courses
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
export function CoursesList() {
    const { user } = useAuth();
    const isStudent = user?.role === ROLES.STUDENT;
    const [courses] = useState([]);
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {isStudent ? 'My Courses' : 'Courses'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isStudent
            ? 'View the courses attached to your student record.'
            : 'Manage course catalog records, academic assignments, semesters, and enrollment-facing status.'}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <BookOpen className="size-5"/>
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isStudent ? 'My Course Directory' : 'Course Directory'}</CardTitle>
          <CardDescription>
            {isStudent
            ? 'Search, filter, and review your enrolled courses.'
            : 'Search, filter, paginate, export, and manage course records.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CoursesDataTable data={courses} isStudent={isStudent}/>
        </CardContent>
      </Card>
    </div>);
}
