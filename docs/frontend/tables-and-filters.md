# Tables & Filters

## Standard

Use TanStack Table with reusable wrappers for:

- Table shell.
- Toolbar.
- Search input.
- Filter controls.
- Pagination.
- Row actions.
- Empty state.
- Export action where needed.

## Performance Rules

- Real API tables use server-side pagination, filtering, sorting, and search.
- Do not fetch all records and filter in React for production data.
- Initial page load should request only the visible table page.
- Hidden tab tables load when the tab is opened.
- Filters and pagination do not update URL query strings by default unless the view is explicitly shareable.

## Actions

- Destructive, financial, permission, user-status, and record-status row actions require a confirmation dialog.
