import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/cn';
import { formatCurrency, formatDate } from '@/features/payments/payment-constants';
import { getInvoiceByNumber } from '@/services/payments.service';
import { INVOICE_STATUS_STYLES as statusStyles, PAYMENT_STATUS_STYLES as paymentStatusStyles } from '@/lib/status-styles';

export function PaymentDetails() {
    const { invoiceNumber } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchInvoice = useCallback(() => {
        if (!invoiceNumber) return;
        setLoading(true);
        getInvoiceByNumber(invoiceNumber)
            .then((data) => setInvoice(data))
            .catch(() => setError('Invoice not found.'))
            .finally(() => setLoading(false));
    }, [invoiceNumber]);

    useEffect(() => { fetchInvoice(); }, [fetchInvoice]);

    if (loading) {
        return (<div className="space-y-4">
          <Button asChild variant="ghost" className="-ml-3 w-fit"><Link to="/payments"><ArrowLeft /> Back to payments</Link></Button>
          <p className="text-sm text-muted-foreground">Loading invoice details...</p>
        </div>);
    }

    if (error || !invoice) {
        return (<div className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Invoice not found</AlertTitle>
            <AlertDescription>{error || 'The requested invoice record does not exist.'}</AlertDescription>
          </Alert>
          <Button asChild variant="outline"><Link to="/payments">Back to payments</Link></Button>
        </div>);
    }

    return (<div className="space-y-6">
      <div className="space-y-3">
        <Button asChild type="button" variant="ghost" className="-ml-3 w-fit">
          <Link to="/payments"><ArrowLeft /> Back to payments</Link>
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Invoice {invoice.invoice_number}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Invoice details and payment history</p>
          </div>
          <Badge className={cn('whitespace-nowrap text-sm', statusStyles[invoice.status] || '')}>{invoice.status}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Total Amount</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{formatCurrency(invoice.amount)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Paid</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold text-emerald-600">{formatCurrency(invoice.paid_amount)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Balance</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold text-destructive">{formatCurrency(invoice.balance)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Due Date</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{formatDate(invoice.due_date)}</p></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Student</span><span className="font-medium">{invoice.student}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Admission #</span><span className="font-medium">{invoice.admission_no || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span className="font-medium">{invoice.department || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Fee Type</span><span className="font-medium">{invoice.fee_name || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Academic Year</span><span className="font-medium">{invoice.academic_year || '-'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Semester</span><span className="font-medium">{invoice.semester || '-'}</span></div>
            {invoice.notes && <div className="flex justify-between"><span className="text-muted-foreground">Notes</span><span className="font-medium">{invoice.notes}</span></div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Payment History</CardTitle><CardDescription>{invoice.payments?.length || 0} payment(s) recorded</CardDescription></CardHeader>
          <CardContent>
            {invoice.payments?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.payments?.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{formatDate(p.created_at)}</TableCell>
                      <TableCell>{p.payment_method || '-'}</TableCell>
                      <TableCell>{formatCurrency(p.amount)}</TableCell>
                      <TableCell><Badge className={cn('whitespace-nowrap', (paymentStatusStyles[p.status] || ''))}>{p.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>);
}
