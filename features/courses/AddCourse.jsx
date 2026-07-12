import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
export function AddCourse() {
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Add Course</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new course catalog record.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Course creation will be available once the backend endpoints are connected.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">The create course form is ready for backend integration.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/courses">Back to Courses</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);
}
