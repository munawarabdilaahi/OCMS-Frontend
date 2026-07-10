import { ArrowLeft, CalendarDays, CreditCard, FileText, GraduationCap, Receipt, UserRound } from 'lucide-react';
import { Link, useParams } from '@/lib/router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { formatCurrency, formatDate, getPaymentByInvoiceNumber } from '@/features/payments/PaymentsList';
import { ROLES } from '@/lib/roles';
const statusStyles = {
    Paid: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    Pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Overdue: 'bg-destructive/10 text-destructive',
    Failed: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
};
function DetailItem({ icon: Icon, label, value }) {
    return (<div className="rounded-md border bg-background p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4"/>
        {label}
      </div>
      <p className="mt-2 font-medium">{value}</p>
    </div>);
}
export function PaymentDetails() {
    const { invoiceNumber } = useParams();
    const { user } = useAuth();
    const payment = getPaymentByInvoiceNumber(invoiceNumber);
    if (!payment || (user?.role === ROLES.STUDENT && payment.studentId !== user.studentId)) {
        return (<div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Payment not found</AlertTitle>
          <AlertDescription>The requested mock payment or invoice record does not exist.</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/payments">Back to payments</Link>
        </Button>
      </div>);
    }
    const paidAmount = payment.amount - payment.balance;
    return (<div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Button asChild type="button" variant="ghost" className="-ml-3 w-fit">
            <Link to="/payments">
              <ArrowLeft />
              Back to payments
            </Link>
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">{payment.invoiceNumber}</h1>
              <Badge className={cn('whitespace-nowrap', statusStyles[payment.status])}>{payment.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {payment.student} · {payment.term}
            </p>
          </div>
        </div>

        {user?.role !== ROLES.STUDENT && (<Button asChild>
            <Link to="/payments/invoices">
              <FileText />
              View Invoices
            </Link>
          </Button>)}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailItem icon={Receipt} label="Invoice Amount" value={formatCurrency(payment.amount)}/>
        <DetailItem icon={CreditCard} label="Paid Amount" value={formatCurrency(paidAmount)}/>
        <DetailItem icon={CalendarDays} label="Payment Date" value={formatDate(payment.date)}/>
        <DetailItem icon={CalendarDays} label="Due Date" value={formatDate(payment.dueDate)}/>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Student billing and payment information for this invoice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Student</p>
                <p className="font-medium">{payment.student}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-medium">{payment.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Program</p>
                <p className="font-medium">{payment.program}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{payment.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Term</p>
                <p className="font-medium">{payment.term}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                <p className="font-medium">{formatCurrency(payment.balance)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1 text-sm leading-6">{payment.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Snapshot</CardTitle>
            <CardDescription>Current balance status for this student invoice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem icon={UserRound} label="Account Holder" value={payment.student}/>
            <DetailItem icon={GraduationCap} label="Academic Program" value={payment.program}/>
            <div className="rounded-md border bg-background p-4">
              <p className="text-sm text-muted-foreground">Collection Progress</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((paidAmount / payment.amount) * 100)}%` }}/>
              </div>
              <p className="mt-2 text-sm font-medium">{Math.round((paidAmount / payment.amount) * 100)}% collected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Line Items</CardTitle>
          <CardDescription>Breakdown of the current mock invoice charge.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{payment.description}</TableCell>
                  <TableCell>{payment.term}</TableCell>
                  <TableCell>
                    <Badge className={cn('whitespace-nowrap', statusStyles[payment.status])}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="font-medium text-right">
                    Balance
                  </TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(payment.balance)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>);
}
