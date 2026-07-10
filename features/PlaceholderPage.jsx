import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
export function PlaceholderPage({ title, description }) {
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Module Architecture</CardTitle>
          <CardDescription>This route is registered and protected for the correct roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            Screens, tables, charts, and forms for this module will be added in the next frontend phases.
          </p>
        </CardContent>
      </Card>
    </div>);
}
