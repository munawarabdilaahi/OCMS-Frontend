## Frontend Rules

- Use feature folders and shared components.
- API access goes through `services/*.service.js`.
- Real data tables use server-side pagination/filtering/sorting.
- Do not load hidden tab data on initial render.
- Confirmation dialogs are required for destructive, financial, permission, user-status, and record-status actions.
- Data tables, filters, pagination, dialogs, empty states, badges, and action menus must be reusable components.
- Split large feature files into local components.
- A feature file over 500 lines is a refactor warning.

## Performance Rules

- Request only the current table page.
- Avoid client-side filtering over large API datasets.
- Load hidden tabs, charts, and secondary panels on demand.
- Keep URL query strings stable by default unless a view is intentionally shareable.

## Verification

- Run `npm run build` after significant UI/routing changes.
