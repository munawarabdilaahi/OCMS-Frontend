export function InfoGrid({ items }) {
    return (<div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (<div key={item.label} className="rounded-lg border bg-secondary/30 p-4">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="font-medium">{item.value || '—'}</p>
        </div>))}
    </div>);
}
