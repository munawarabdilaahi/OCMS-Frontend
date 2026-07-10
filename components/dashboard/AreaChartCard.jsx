import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
function formatCompact(value) {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}
function DashboardTooltip({ active, payload, label, formatter }) {
    if (!active || !payload?.length) {
        return null;
    }
    const item = payload[0];
    return (<div className="rounded-md border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      <p className="text-muted-foreground">
        {item.name}: <span className="font-medium text-foreground">{formatter(item.value)}</span>
      </p>
    </div>);
}
export function AreaChartCard({ title, description, data, dataKey, color, gradientId, valueFormatter = formatCompact, }) {
    return (<Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.32}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border))"/>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={12} stroke="rgb(var(--muted-foreground))" fontSize={12}/>
              <YAxis axisLine={false} tickLine={false} tickMargin={10} width={42} stroke="rgb(var(--muted-foreground))" fontSize={12} tickFormatter={valueFormatter}/>
              <Tooltip cursor={{ stroke: color, strokeOpacity: 0.18, strokeWidth: 2 }} content={<DashboardTooltip formatter={valueFormatter}/>}/>
              <Area type="monotone" dataKey={dataKey} name={title.replace(' Trend', '')} stroke={color} strokeWidth={2.5} fill={`url(#${gradientId})`} activeDot={{ r: 5, fill: color, stroke: 'rgb(var(--background))', strokeWidth: 2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>);
}
