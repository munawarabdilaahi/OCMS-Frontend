# Design System: OCMS

## Direction

OCMS should feel like a practical campus operations dashboard: clear, structured, responsive, and easy to scan.

## UI Rules

- Use existing Tailwind and Radix UI components.
- Keep spacing consistent across feature pages.
- Prefer dense but readable tables for operational screens.
- Use badges for status.
- Use dialogs for create/edit confirmations and destructive action confirmation.
- Use empty states for no-data screens.
- Keep forms grouped into clear sections.

## Component Rules

- Build reusable data-table primitives before creating another one-off table.
- Build reusable confirmation dialogs and action menus.
- Build reusable filter bars and pagination controls.
- Split large feature screens into local components.

## Do Not

- Do not copy/paste whole table implementations per module.
- Do not rely on color alone for status.
- Do not hide destructive actions without confirmation.
