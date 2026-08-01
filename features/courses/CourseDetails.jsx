import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Pencil } from 'lucide-react';
import { Link, useParams } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoGrid } from '@/components/common/InfoGrid';
import { getCourse } from '@/services/courses.service';
import { cn } from '@/lib/cn';

const statusStyles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    INACTIVE: 'bg-muted text-muted-foreground',
};

export function CourseDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!id) return;
        getCourse(id)
            .then((data) => {
                if (!data) { setError('Course not found.'); return; }
                setCourse(data);
            })
            .catch(() => setError('Failed to load course.'))
            .finally(() => setLoading(false));
    }, [id]);
    if (loading) {
        return <div className="flex items-center justify-center p-12"><p className="text-muted-foreground">Loading course...</p></div>;
    }
    if (error || !course) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Course not found</AlertTitle>
          <AlertDescription>{error || 'The requested course does not exist.'}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/courses">
            <ArrowLeft />
            Back to courses
          </Link>
        </Button>
      </div>);
    }
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-lg bg-primary/15 text-emerald-700 dark:text-teal-200">
            <BookOpen className="size-8"/>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-normal">{course.title}</h1>
              <Badge className={cn(statusStyles[course.status] || '')}>{course.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{course.code || 'No code assigned'}</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/courses/${course.id}/edit`}>
            <Pencil />
            Edit Course
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Academic and administrative details for this course.</CardDescription>
        </CardHeader>
        <CardContent>
          <InfoGrid items={[
            { label: 'Course Code', value: course.code || '-' },
            { label: 'Course Title', value: course.title || '-' },
            { label: 'Credit Hours', value: course.credit_hours || '-' },
            { label: 'Department', value: course.department || '-' },
            { label: 'Assigned Teacher', value: course.teacher || '-' },
            { label: 'Semester', value: course.semester || '-' },
            { label: 'Status', value: course.status || '-' },
          ]}/>
        </CardContent>
      </Card>
    </div>);
}
