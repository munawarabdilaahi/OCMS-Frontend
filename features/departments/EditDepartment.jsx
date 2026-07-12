import { Link, useParams } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
export function EditDepartment() {
    const { departmentCode } = useParams();
    return (<div className="space-y-4">
      <Alert variant="destructive">
        <AlertTitle>Department not found</AlertTitle>
        <AlertDescription>The requested department record does not exist.</AlertDescription>
      </Alert>
      <Button asChild variant="outline">
        <Link to="/departments">Back to departments</Link>
      </Button>
    </div>);
}
