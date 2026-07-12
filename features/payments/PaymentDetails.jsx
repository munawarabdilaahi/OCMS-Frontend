import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
export function PaymentDetails() {
    const { invoiceNumber } = useParams();
    return (<div className="space-y-4">
      <Alert variant="destructive">
        <AlertTitle>Payment not found</AlertTitle>
        <AlertDescription>The requested payment or invoice record does not exist.</AlertDescription>
      </Alert>
      <Button asChild variant="outline">
        <Link to="/payments">Back to payments</Link>
      </Button>
    </div>);
}
