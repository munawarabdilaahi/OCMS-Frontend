/* eslint-disable react-hooks/incompatible-library, react-refresh/only-export-components */
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, BookOpen, Download, Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { EmptyState } from '@/components/common/EmptyState';
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
export const courseDepartments = ['Computer Science', 'Business', 'Engineering', 'Health Sciences', 'Education', 'Physics'];
export const courseTeachers = [
    'Dr. Sarah Johnson',
    'Michael Chen',
    'Dr. Emily Brown',
    'James Wilson',
    'Dr. Grace Kimani',
    'Prof. Amina Hassan',
];
export const courseSemesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Summer'];
export const courseStatuses = ['Active', 'Draft', 'Completed', 'Archived'];
export const defaultCourses = [
    {
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Foundational programming concepts, algorithms, data types, and problem solving with code.',
        creditHours: 3,
        department: 'Computer Science',
        teacher: 'Dr. Sarah Johnson',
        semester: 'Semester 1',
        status: 'Active',
        enrolledStudents: [
            { id: 'STU-2026-001', name: 'Amina Hassan', attendance: '94%', result: 'A' },
            { id: 'STU-2026-006', name: 'Noah Bennett', attendance: '88%', result: 'B+' },
            { id: 'STU-2026-009', name: 'Ibrahim Ali', attendance: '91%', result: 'A-' },
        ],
    },
    {
        code: 'BUS210',
        name: 'Financial Accounting',
        description: 'Accounting principles, financial statements, ledgers, reporting cycles, and controls.',
        creditHours: 4,
        department: 'Business',
        teacher: 'Michael Chen',
        semester: 'Semester 2',
        status: 'Active',
        enrolledStudents: [
            { id: 'STU-2026-002', name: 'Daniel Okafor', attendance: '90%', result: 'B+' },
            { id: 'STU-2026-007', name: 'Sara Patel', attendance: '96%', result: 'A' },
        ],
    },
    {
        code: 'ENG305',
        name: 'Structural Analysis',
        description: 'Load paths, structural systems, statics, and analysis methods for civil engineering design.',
        creditHours: 4,
        department: 'Engineering',
        teacher: 'James Wilson',
        semester: 'Semester 3',
        status: 'Draft',
        enrolledStudents: [
            { id: 'STU-2026-004', name: 'Mateo Rivera', attendance: '87%', result: 'B' },
            { id: 'STU-2026-008', name: 'Omar Farah', attendance: '92%', result: 'A-' },
        ],
    },
    {
        code: 'NUR120',
        name: 'Clinical Foundations',
        description: 'Patient care fundamentals, clinical safety, documentation, and professional practice.',
        creditHours: 3,
        department: 'Health Sciences',
        teacher: 'Dr. Grace Kimani',
        semester: 'Semester 1',
        status: 'Active',
        enrolledStudents: [
            { id: 'STU-2026-003', name: 'Leila Mohamed', attendance: '95%', result: 'A' },
            { id: 'STU-2026-010', name: 'Hana Yusuf', attendance: '89%', result: 'B+' },
        ],
    },
    {
        code: 'EDU240',
        name: 'Curriculum Design',
        description: 'Curriculum planning, learning objectives, assessment alignment, and classroom delivery.',
        creditHours: 3,
        department: 'Education',
        teacher: 'Prof. Amina Hassan',
        semester: 'Semester 4',
        status: 'Completed',
        enrolledStudents: [
            { id: 'STU-2026-005', name: 'Grace Kimani', attendance: '98%', result: 'A' },
            { id: 'STU-2026-011', name: 'Maryam Aden', attendance: '93%', result: 'A-' },
        ],
    },
    {
        code: 'PHY400',
        name: 'Quantum Mechanics',
        description: 'Wave functions, operators, quantum states, measurement, and selected modern physics topics.',
        creditHours: 4,
        department: 'Physics',
        teacher: 'Dr. Emily Brown',
        semester: 'Semester 4',
        status: 'Archived',
        enrolledStudents: [
            { id: 'STU-2026-012', name: 'Leo Martins', attendance: '85%', result: 'B' },
            { id: 'STU-2026-013', name: 'Fatima Noor', attendance: '91%', result: 'A-' },
        ],
    },
];
const storageKey = 'ocms-courses';
const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Draft: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Completed: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    Archived: 'bg-muted text-muted-foreground',
};
function readStoredCourses() {
    if (typeof window === 'undefined') {
        return defaultCourses;
    }
    try {
        const storedCourses = window.localStorage.getItem(storageKey);
        return storedCourses ? JSON.parse(storedCourses) : defaultCourses;
    }
    catch {
        return defaultCourses;
    }
}
export function getCourses() {
    return readStoredCourses();
}
export function getCourseByCode(code) {
    return getCourses().find((course) => course.code === code);
}
export function getCoursesByStudentId(studentId) {
    return getCourses().filter((course) => course.enrolledStudents?.some((student) => student.id === studentId));
}
export function saveCourse(course) {
    const courses = getCourses();
    const nextCourses = courses.some((item) => item.code === course.code)
        ? courses.map((item) => (item.code === course.code ? { ...item, ...course } : item))
        : [{ enrolledStudents: [], ...course }, ...courses];
    window.localStorage.setItem(storageKey, JSON.stringify(nextCourses));
    return nextCourses;
}
export function deleteCourse(code) {
    const nextCourses = getCourses().filter((course) => course.code !== code);
    window.localStorage.setItem(storageKey, JSON.stringify(nextCourses));
    return nextCourses;
}
function SortButton({ column, children }) {
    return (<Button type="button" variant="ghost" className="-ml-3 h-8 px-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {children}
      <ArrowUpDown className="ml-1 size-3.5"/>
    </Button>);
}
function exportCourses(rows) {
    const headers = ['Course Code', 'Course Name', 'Credit Hours', 'Department', 'Teacher', 'Semester', 'Status'];
    const body = rows.map((row) => {
        const course = row.original;
        return [course.code, course.name, course.creditHours, course.department, course.teacher, course.semester, course.status];
    });
    const csv = [headers, ...body]
        .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ocms-courses.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}
function CoursesDataTable({ data, onDelete, isStudent = false }) {
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
                  <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.original.code)}>
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </>)}
            </DropdownMenuContent>
          </DropdownMenu>),
        },
    ], [isStudent, onDelete]);
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
              {courseDepartments.map((department) => (<SelectItem key={department} value={department}>
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
                  <EmptyState title="No courses found" description="Adjust your filters or add a new course record." actionLabel={isStudent ? undefined : 'Add Course'} actionTo={isStudent ? undefined : '/courses/add'}/>
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
    const [courses, setCourses] = useState(() => (isStudent ? getCoursesByStudentId(user.studentId) : getCourses()));
    const [deletedCode, setDeletedCode] = useState('');
    const handleDelete = useCallback((code) => {
        const confirmed = window.confirm(`Delete course ${code}? This only updates mock frontend data.`);
        if (!confirmed) {
            return;
        }
        setCourses(deleteCourse(code));
        setDeletedCode(code);
    }, []);
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

      {deletedCode && (<Alert>
          <AlertTitle>Course removed</AlertTitle>
          <AlertDescription>{deletedCode} was removed from the mock table data.</AlertDescription>
        </Alert>)}

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
          <CoursesDataTable data={courses} onDelete={handleDelete} isStudent={isStudent}/>
        </CardContent>
      </Card>
    </div>);
}
