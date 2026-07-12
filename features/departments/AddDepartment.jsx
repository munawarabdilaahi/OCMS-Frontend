import { Link } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
export function AddDepartment() {
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Add Department</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new academic department record.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
          <CardDescription>Department creation will be available once the backend endpoints are connected.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">The create department form is ready for backend integration.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/departments">Back to Departments</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);
}
