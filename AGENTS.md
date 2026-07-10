# OCMS Frontend Agent Guide

This is the root guide for AI agents working in the OCMS frontend repository.

## Project Snapshot

`OCMS-Frontend` is the Next/React UI for the Online Campus Management System.

Stack:

- Next 15
- React 19
- Tailwind 4
- Radix UI
- TanStack Table
- Axios
- React Hook Form
- Zod
- Recharts

## Clone & Adapt Protocol

- Find the closest existing feature, component, table, form, dialog, API service, or layout before creating a new one.
- Keep students, teachers, courses, exams, attendance, payments, settings, and dashboard screens structurally consistent.
- Extract shared behavior instead of copy-pasting it a third time.
- Do not create a second way to build tables, filters, dialogs, action menus, badges, or forms.

## Living Docs Protocol

A frontend change is incomplete until docs match the code.

Before finishing:

1. Review modified files.
2. Detect new pages, feature screens, reusable components, services, forms, dialogs, tables, filters, or role-gated navigation.
3. Update the relevant file under `docs/`.
4. Append a concise versioned entry to `CHANGELOG.md`.
5. Run the smallest relevant verification command.

## Test & Verification Enforcement

- Every behavior change needs an automated test or a clear note explaining why it could not be tested.
- Run `npm run build` after significant UI/routing changes.
- Add browser/component testing before relying on manual checks as the UI grows.

## Frontend Standards

- Use feature folders under `features`.
- Use shared components under `components`.
- API calls go through `services/*.service.js` and the shared Axios client.
- Forms use React Hook Form + Zod when validation is needed.
- Tables use TanStack Table, but server-side pagination/filtering/sorting is the default for real API data.
- Do not load hidden tab data on initial render. Fetch tab data when the tab is opened.
- Filters and pagination should not update URL query strings by default unless the view is intentionally shareable.
- Reusable UI is mandatory: data tables, filters, pagination, row actions, modals, confirmation dialogs, empty states, status badges, and form sections.
- Every destructive, financial, permission, user-status, or record-status action needs a confirmation dialog.
- Large feature files must be split into local components. A feature over 500 lines is a refactor warning.

## Performance First

- Frontend tables must request only the current page.
- Avoid client-side filtering over large datasets.
- Load dashboard charts, hidden tabs, and secondary panels lazily.
- Use memoization for expensive derived view state, not for business rules.
- Keep API service methods aligned with backend pagination/filtering contracts.

## Documentation Map

- `CONTEXT.md` - domain glossary.
- `PRODUCT.md` - product purpose and principles.
- `DESIGN.md` - UI/design standards.
- `docs/README.md` - documentation index.
- `docs/domain/` - campus domain concepts relevant to UI.
- `docs/frontend/` - Next, tables, forms, dialogs, and design.
- `docs/operations/` - frontend local development workflow.
- `.cursor/skills/` - local frontend project skills.
- `.ai/guidelines/` - compact rule files.
- `CHANGELOG.md` - chronological frontend documentation/change log.

## Hot Paths

| File | Role |
| :--- | :--- |
| `app/layout.jsx` | Next root layout |
| `app/app-shell.jsx` | App shell |
| `app/[[...segments]]/page.jsx` | Catch-all page entry |
| `features/**` | Feature screens |
| `components/**` | Shared UI and feature components |
| `services/api.js` | Shared Axios client |
| `services/*.service.js` | API wrappers |
| `lib/navigation.js` | Navigation configuration |
| `lib/roles.js` | Frontend role helpers |
| `context/AuthContext.jsx` | Auth state |

## Skill Routing

Use the local skill before working in that area:

- Next/React pages/components: `.cursor/skills/next-react-development/SKILL.md`
- TanStack tables/filter/pagination: `.cursor/skills/tanstack-table-development/SKILL.md`
- JWT/RBAC/auth UI: `.cursor/skills/auth-jwt-rbac-development/SKILL.md`

## Do Not

- Do not create giant feature files.
- Do not repeat table/filter/dialog/form logic.
- Do not fetch all rows for table pages.
- Do not make frontend-only authorization the source of truth.
- Do not hardcode API hostnames outside the shared API client configuration.
