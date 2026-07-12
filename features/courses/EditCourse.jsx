import { Link, useParams } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
export function EditCourse() {
    const { courseCode } = useParams();
    return (<div className="space-y-4">
      <Alert variant="destructive">
        <AlertTitle>Course not found</AlertTitle>
        <AlertDescription>The requested course record does not exist.</AlertDescription>
      </Alert>
      <Button asChild variant="outline">
        <Link to="/courses">Back to courses</Link>
      </Button>
    </div>);
}
