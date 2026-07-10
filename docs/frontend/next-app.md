# Next App

## Structure

- `app/layout.jsx` - root layout.
- `app/app-shell.jsx` - app shell.
- `app/[[...segments]]/page.jsx` - catch-all page entry.
- `features/**` - feature screens.
- `components/**` - reusable UI and feature components.
- `services/**` - API access.
- `layouts/**` - layout components.
- `context/**` - React context.
- `lib/**` - navigation, roles, router, utilities.

## Rules

- Keep feature files small by extracting local components.
- API calls go through services.
- Shared UI belongs in components.
- Avoid route/page files doing business logic.
