---
name: next-react-development
description: Use when working on OCMS Next.js/React frontend pages, feature folders, shared components, layouts, API services, forms, dialogs, dashboard screens, or UI refactors in OCMS-Frontend.
---

# Next & React Development

## Required Reads

- `AGENTS.md`
- `DESIGN.md`
- `docs/frontend/next-app.md`
- Relevant sibling feature/component files.

## Rules

- Keep feature files small; extract local components.
- API calls go through `services/*.service.js`.
- Reuse UI primitives from `components/ui`.
- Do not repeat table, dialog, badge, filter, or form patterns.
- Load hidden tabs and expensive panels on demand.
- Add confirmation dialogs for destructive/status-changing actions.

## Verification

Run in `OCMS-Frontend`:

```bash
npm run build
```
