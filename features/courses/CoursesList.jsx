import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { ArrowUpDown, BookOpen, Download, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from '@/lib/router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { getCourses, deleteCourse } from '@/services/courses.service';

export const courseSemesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Summer'];
export const courseStatuses = ['ACTIVE', 'DRAFT', 'COMPLETED', 'ARCHIVED'];
const statusStyles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    DRAFT: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    COMPLETED: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
    ARCHIVED: 'bg-muted text-muted-foreground',
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
        const c = row.original;
        return [c.code, c.title, c.credit_hours, c.department, c.teacher, c.semester, c.status];
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

function CoursesDataTable({ data, isStudent = false, onDelete }) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const columns = useMemo(() => [
        {
            accessorKey: 'code',
            header: ({ column }) => <SortButton column={column}>Course Code</SortButton>,
            cell: ({ row }) => <span className="font-medium">{row.original.code || '-'}</span>,
        },
        {
            accessorKey: 'title',
            header: ({ column }) => <SortButton column={column}>Course Name</SortButton>,
        },
        {
            accessorKey: 'credit_hours',
            header: ({ column }) => <SortButton column={column}>Credit Hours</SortButton>,
            cell: ({ row }) => row.original.credit_hours ?? '-',
        },
        {
            accessorKey: 'department',
            header: ({ column }) => <SortButton column={column}>Department</SortButton>,
        },
        {
            accessorKey: 'teacher',
            header: ({ column }) => <SortButton column={column}>Teacher</SortButton>,
            cell: ({ row }) => row.original.teacher || '-',
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
                <Link to={`/courses/${row.original.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              {!isStudent && (<>
                  <DropdownMenuItem asChild>
                    <Link to={`/courses/${row.original.id}/edit`}>
                      <Pencil />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.original.id, row.original.title)}>
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
          <Input className="pl-9" placeholder="Search courses..." value={globalFilter ?? ''} onChange={(event) => setGlobalFilter(event.target.value)}/>
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
                  <EmptyState title="No courses found" description="Create a course to get started." actionLabel="Add Course" actionTo="/courses/add"/>
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
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        getCourses()
            .then((response) => {
                const data = response?.data ?? response ?? [];
                setCourses(Array.isArray(data) ? data : []);
            })
            .catch(() => setError('Failed to load courses.'))
            .finally(() => setLoading(false));
    }, []);
    const handleDelete = useCallback(async (id, title) => {
        if (!window.confirm(`Delete course "${title}"? This action cannot be undone.`)) return;
        try {
            await deleteCourse(id);
            toast.success('Course deleted successfully.');
            setCourses((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            toast.error(err.message || 'Failed to delete course.');
        }
    }, []);
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {isStudent ? 'My Courses' : 'Courses'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${courses.length} course${courses.length !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <BookOpen className="size-5"/>
        </span>
      </div>

      {error && (<Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>)}

      <Card>
        <CardHeader>
          <CardTitle>{isStudent ? 'My Course Directory' : 'Course Directory'}</CardTitle>
          <CardDescription>Search, filter, paginate, export, and manage course records.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          ) : (
            <CoursesDataTable data={courses} isStudent={isStudent} onDelete={handleDelete}/>
          )}
        </CardContent>
      </Card>
    </div>);
}
