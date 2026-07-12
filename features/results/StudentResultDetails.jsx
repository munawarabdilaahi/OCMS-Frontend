import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpenCheck } from 'lucide-react';
import { Link, useParams } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { getExamResults } from '@/services/exams.service';
import { ROLES } from '@/lib/roles';
export function StudentResultDetails() {
    const { studentId } = useParams();
    const { user } = useAuth();
    const visibleStudentId = user?.role === ROLES.STUDENT ? user.studentId : studentId;
    const isDenied = user?.role === ROLES.STUDENT && studentId !== user.studentId;
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getExamResults({ student_id: visibleStudentId })
            .then((response) => {
            const data = Array.isArray(response) ? response : [];
            setResults(data);
        })
            .catch(() => setResults([]))
            .finally(() => setLoading(false));
    }, [visibleStudentId]);
    if (isDenied) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Access denied</AlertTitle>
          <AlertDescription>You can only view your own results.</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/results">Back to results</Link>
        </Button>
      </div>);
    }
    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading results...</p></div>;
    }
    const studentResult = results[0];
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Button asChild type="button" variant="ghost" className="-ml-3 w-fit">
            <Link to="/results">
              <ArrowLeft />
              Back to results
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
              {studentResult?.studentName || studentResult?.student?.name || visibleStudentId}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{visibleStudentId} result profile and performance summary.</p>
          </div>
        </div>
        {results.length > 0 && (<Badge className="w-fit bg-primary/10 text-primary">
            <BookOpenCheck className="mr-1 size-3.5"/>
            {results.length} Courses
          </Badge>)}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Results</CardTitle>
          <CardDescription>Detailed marks, grades, and GPA by course.</CardDescription>
        </CardHeader>
        <CardContent>
          {results.length > 0 ? (<div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (<TableRow key={index}>
                      <TableCell className="font-medium">{result.course || result.course_id}</TableCell>
                      <TableCell>{result.marks ?? result.total_score ?? '-'}</TableCell>
                      <TableCell>{result.grade || '-'}</TableCell>
                      <TableCell>{result.status || '-'}</TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>
            </div>) : (<p className="text-sm text-muted-foreground">No results found for this student.</p>)}
        </CardContent>
      </Card>
    </div>);
}
