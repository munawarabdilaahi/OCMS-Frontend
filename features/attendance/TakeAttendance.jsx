import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
function TakeAttendance() {
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Take Attendance</h1>
        <p className="mt-1 text-sm text-muted-foreground">Mark attendance for a course session and class date.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>Taking attendance will be available once the backend endpoints are connected.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">The take attendance form is ready for backend integration.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/attendance">Back to Attendance</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);
}
export { TakeAttendance };
export default TakeAttendance;
