# Enhancements

Future improvements I'd make given more time, organized by priority.

## Payment Feature (Immediate Next Steps)

- **Payment amount validation**: Add min/max bounds on invoice amounts, prevent negative values on the frontend with input constraints (not just API validation)
- **Payment receipt**: After marking an invoice paid, show a confirmation state with timestamp of when payment was received
- **Partial payments**: Support multiple payments against a single invoice, track remaining balance
- **Payment method tracking**: Add a `paymentMethod` field (check, credit card, cash, ACH) to the Payment model
- **Undo payment**: Allow staff to revert a "paid" status if marked by mistake, with an audit trail
- **Currency formatting**: Move `formatCurrency` to a shared utility instead of defining it inline in RecordDetailsSection

## Accessibility

- **Modal focus trap**: The Modal component has no focus trapping, no Escape key handler, and no focus restoration. Would add a `useFocusTrap` hook and wire it into the Modal primitive.
- **Keyboard navigation on table rows**: Record rows in RecordsPage are clickable via onClick but have no `role="button"`, no `tabIndex`, and no `onKeyDown` handler. Screen reader and keyboard users can't navigate records.
- **ARIA labels on status pills**: Status pills render text but lack `role="status"` or `aria-label` with context (e.g., "Record status: Submitted")
- **Form error states**: SendEmailWorkspace and PaymentWorkspace have no visible validation error messages. Would add inline error text below inputs with `aria-describedby` linking.

## Design System

- **Shared Button component**: Every button in the app is a raw `<button>` with duplicated Tailwind classes. Would extract a `Button` primitive with `variant` (primary, secondary, ghost), `size` (sm, md, lg), and `loading` props.
- **Shared StatusPill component**: `RecordStatusPill` and `WorkflowStatusPill` are nearly identical. Would merge into a single `StatusPill` with a `colorMap` prop.
- **Consistent spacing tokens**: Define a spacing scale and apply it across all components instead of ad-hoc Tailwind values.
- **Loading skeletons**: Replace "Loading..." text strings with skeleton screens that match the layout of the loaded content.
- **Transition animations**: Add enter/exit transitions on modals, status changes, and step completions for a more polished feel.

## API / Data Layer

- **Record status transition to InProgress**: Currently a record stays "Submitted" even after staff begins working on it. Should transition to "InProgress" when the first task is completed.
- **Input validation on record creation**: The API allows creating a record with an empty `workflowSteps` array. Should require at least one step.
- **Pagination**: Records list fetches everything. Would add cursor-based pagination with a `take`/`skip` or `after` pattern.
- **Filtering and search**: Add GraphQL query arguments for filtering records by status, date range, and step type.
- **Audit log**: Track all state changes (who completed which step, when) in a separate `AuditEvent` model for compliance and debugging.
- **Soft deletes**: Add `deletedAt` field instead of hard deleting records, important for government compliance.

## Testing

- **Service tests**: Add integration tests for `completeWorkflowStepTask` covering the cascade logic (task done, step done, record done) and the Payment two-subtask flow.
- **Component tests**: Add tests for PaymentWorkspace covering both subtask states, validation, and the transition between configure and pay phases.
- **E2E test**: Add a Playwright test that creates a record with a Payment step, configures an invoice, pays it, and verifies the record completes.
