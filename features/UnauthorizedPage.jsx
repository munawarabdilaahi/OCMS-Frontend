import { useRouter } from 'next/navigation';
import { ShieldX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-3">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="size-7 text-destructive" />
          </div>
          <CardTitle className="text-xl">Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to view this page. Contact your administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.replace('/dashboard')}>
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
