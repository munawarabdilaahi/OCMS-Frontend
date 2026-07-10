---
name: tanstack-table-development
description: Use when creating or refactoring OCMS data tables, table filters, pagination, sorting, row actions, bulk actions, empty states, exports, server-side table APIs, or TanStack Table code.
---

# TanStack Table Development

## Required Reads

- `AGENTS.md`
- `docs/frontend/tables-and-filters.md`
- `docs/backend/prisma-and-mysql.md` when table data comes from the API.

## Rules

- Use reusable table primitives.
- Real API tables use server-side pagination/filter/search/sort.
- Do not fetch all rows for React-side filtering in production data.
- Keep row actions in reusable action-menu components.
- Confirmation dialogs are mandatory for destructive/status/permission/financial actions.
- List API responses should include `{ data, meta }`.

## Verification

Run relevant frontend build and backend checks when both sides change.
