# Forms & Dialogs

## Forms

- Use React Hook Form with Zod validation when validation is needed.
- Keep form schemas close to the feature or shared if reused.
- Use shared input, select, textarea, label, and error display components.
- Submit through `services/*.service.js`.

## Dialogs

- Use Radix Dialog primitives through existing UI components.
- Confirmation dialogs are mandatory for destructive/status-changing actions.
- Dialog content should clearly name the record and consequence.
- Do not use `window.confirm` for production UI.
