# Changelog

## feat: add Payment workflow step type with invoice configuration and payment tracking

**Date:** March 3, 2026

Added a new `Payment` workflow step type that enables government staff to configure and collect payments as part of a record's workflow. The Payment step has two subtasks: configuring the invoice amount, then marking it as paid.

### What changed

**Database layer**
- Added `Payment` model with `invoiceAmount`, `invoicePaid`, and `workflowStepId` fields
- Added `Payment` enum value to `WorkflowStepType` and `WorkflowStepTaskType`
- Payment step creates two `WorkflowStepTask` records (order 0: configure invoice, order 1: pay invoice)

**API layer**
- Added `Payment` GraphQL type with `id`, `invoiceAmount`, `invoicePaid`, `createdAt` fields
- Added `PaymentWorkflowStepTaskInput` input type with `amount` field
- Extended `CompleteWorkflowStepTaskInput` to accept optional `paymentInput`
- `completeWorkflowStepTask` handles Payment type: first subtask creates the invoice record, second subtask marks it paid
- `getRecord` query now includes `payments` relation on workflow steps

**Frontend**
- Created `PaymentWorkspace` component with two-phase UI (configure invoice amount, then confirm payment)
- Added `PaymentFragment` to shared GraphQL fragments
- Extended `WorkflowStepFragment` to include `payments` relation
- Updated `WorkflowStepWorkspaceSection` to render `PaymentWorkspace` for Payment steps
- Updated `WorkflowStepsSectionCard` with subtask progress indicators (checkmarks, active dots) for Payment steps
- Added payment data display (invoice amount, paid status) to `RecordDetailsSection`
- Added `getPaymentTaskDisplayName` utility for subtask labels ("Configure Invoice", "Pay Invoice")
- Added `Payment` to `WorkflowStepTypes` array and display name mapping

### Files affected
- `api/db/schema.prisma`
- `api/db/migrations/` (3 migration files)
- `api/src/graphql/workflowSteps.sdl.ts`
- `api/src/graphql/workflowStepTasks.sdl.ts`
- `api/src/services/records/get.ts`
- `api/src/services/workflowSteps/create.ts`
- `api/src/services/workflowStepTasks/update.ts`
- `web/src/components/WorkflowStepWorkspaceSection/WorkflowStepWorkspaceSection.tsx`
- `web/src/components/WorkflowStepWorkspaceSection/WorkflowStepWorkspaces/PaymentWorkspace.tsx` (new)
- `web/src/components/WorkflowStepsSection/WorkflowStepsSectionCard.tsx`
- `web/src/components/RecordDetailsSection/RecordDetailsSection.tsx`
- `web/src/fragments/fragments.ts`
- `web/src/utils/workflow-step-utils.ts`
