# CLAUDE.md -- Simple GovWell

## What This App Does

GovWell is a workflow automation platform for local governments. This repo is a minimal RedwoodJS app for managing Records (permits, licenses, cases) through step-based workflows. Government staff create records, configure workflow steps, and process each step to completion.

## Stack

- **Framework**: RedwoodJS 8.8.1 (monorepo: `web/` + `api/`)
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **API**: GraphQL (SDL-first), Apollo Client
- **ORM**: Prisma with SQLite (`api/db/dev.db`)
- **Package Manager**: Yarn 4.6.0 (Workspaces)

## Data Model

```
Record (id, status, timestamps)
  |-- WorkflowStep (id, order, type, status, timestamps)
       |-- WorkflowStepTask (id, order, type, status, timestamps)
       |-- Email (id, subject, body, timestamps)
```

### Enums
- **RecordStatus**: Submitted | InProgress | Rejected | Completed | Issued
- **WorkflowStepType**: Review | SendEmail | IssueRecord
- **WorkflowStepStatus**: Pending | Completed
- **WorkflowStepTaskType**: Review | SendEmail | IssueRecord
- **WorkflowStepTaskStatus**: Pending | Completed

### Key Business Logic
- A Record starts as `Submitted` with N WorkflowSteps (0-indexed order).
- Each WorkflowStep auto-creates one WorkflowStepTask of matching type.
- Completing all tasks in a step marks the step `Completed`.
- Completing all steps marks the record `Completed`.
- IssueRecord task type sets the record status to `Issued` immediately.
- Steps are processed sequentially: the "current" step is the first `Pending` one.

## Architecture Patterns (Observed)

### Frontend (`web/src/`)
- **Pages** are route-level screens: `RecordsPage` (list), `RecordDetailsPage` (detail), `HomePage` (redirects to /records).
- **Components** are feature-scoped folders: `CreateRecordModal/`, `WorkflowStepsSection/`, `WorkflowStepWorkspaceSection/` etc.
- **Workspace pattern**: Each WorkflowStepType has its own workspace component (`ReviewWorkspace`, `SendEmailWorkspace`, `IssueRecordWorkspace`) rendered conditionally based on `current.type`.
- **Fetch layer** (`web/src/fetch/`): Thin wrappers around `useQuery`/`useMutation` with GQL documents. NOT in components.
- **Fragments** (`web/src/fragments/fragments.ts`): Shared GQL fragments registered globally via `fragmentRegistry`.
- **Hooks** (`web/src/hooks/`): Custom hooks like `useDisclosure` for UI state.
- **Utils** (`web/src/utils/`): Pure functions for dates, workflow step display names, and finding the current step.
- No auth on frontend (all queries use `@skipAuth`).
- Uses `tailwind-merge` for conditional class merging.
- `React.memo` used on leaf components (`AddedWorkflowStepCard`, `Modal`, `WorkflowStepsSectionCard`).
- Loading/error states handled per-page, not via Cells (RedwoodJS Cells not used).

### API (`api/src/`)
- **SDL files** (`api/src/graphql/`): Define types, queries, mutations. All use `@skipAuth`.
- **Services** (`api/src/services/`): Business logic, organized by entity (records/, workflowSteps/, workflowStepTasks/).
- Services split into `create.ts`, `get.ts`, `update.ts` per entity.
- `completeWorkflowStepTask` uses `db.$transaction` for atomic multi-table updates.
- Cascade logic: completing a task checks if all tasks done -> marks step done -> checks if all steps done -> marks record done.
- Auth is stubbed out (always returns true).

## Commands

```bash
yarn                    # Install dependencies
yarn rw prisma db push                # Run Prisma migrations + seed
yarn gql                # Generate GraphQL TypeScript types
yarn rw dev             # Start dev server (localhost:8910)
yarn rw prisma studio   # DB explorer GUI
```

## Conventions to Follow

- SDL files define the GraphQL contract; services implement resolvers with matching export names.
- Components use `useCallback` for event handlers passed as props.
- GQL queries/mutations live in `web/src/fetch/`, not in components.
- Fragment naming: `[ModelName]Fragment` (e.g., `RecordFragment`, `WorkflowStepFragment`).
- Display name mapping via lookup objects, not inline conditionals.
- Error handling: try/catch in mutation handlers, transaction-based on API side.
- No `any` types. Prisma enums imported from `@prisma/client` on API side, `types/graphql` on web side.

## File Map

### Frontend
| File | Purpose |
|------|---------|
| `web/src/Routes.tsx` | Route definitions: /, /records, /records/:id |
| `web/src/pages/RecordsPage/` | Records list with table, create button, modal |
| `web/src/pages/RecordDetailsPage/` | Record detail: info section + workspace + step sidebar |
| `web/src/components/CreateRecordModal/` | Modal to configure and create new records with workflow steps |
| `web/src/components/WorkflowStepWorkspaceSection/` | Renders the active workspace for the current step |
| `web/src/components/WorkflowStepsSection/` | Sidebar showing all steps with status pills |
| `web/src/components/RecordDetailsSection/` | Record metadata (ID, status, progress, dates) |
| `web/src/components/RecordStatusPill/` | Color-coded status badge for records |
| `web/src/components/WorkflowStatusPill/` | Color-coded status badge for workflow steps |
| `web/src/components/Modal/` | Generic modal container with backdrop |
| `web/src/fetch/records.ts` | GQL queries/mutations for records (with retry logic) |
| `web/src/fetch/workflowStepTasks.ts` | GQL mutation to complete a task |
| `web/src/fragments/fragments.ts` | Shared GQL fragments for Record, WorkflowStep, WorkflowStepTask |
| `web/src/hooks/use-disclosure.ts` | Boolean toggle hook (modal open/close) |
| `web/src/utils/workflow-step-utils.ts` | Step type display names, current step finder |
| `web/src/utils/date-utils.ts` | ISO date formatting |

### API
| File | Purpose |
|------|---------|
| `api/src/graphql/records.sdl.ts` | Record type, CreateRecordInput, queries/mutations |
| `api/src/graphql/workflowSteps.sdl.ts` | WorkflowStep type and enums |
| `api/src/graphql/workflowStepTasks.sdl.ts` | WorkflowStepTask type, CompleteWorkflowStepTaskInput, mutation |
| `api/src/services/records/create.ts` | Creates record + workflow steps + tasks |
| `api/src/services/records/get.ts` | getRecords (list) and getRecord (by id) |
| `api/src/services/workflowSteps/create.ts` | Creates step with auto-generated task |
| `api/src/services/workflowSteps/update.ts` | Cascade: all tasks done -> step done -> record done |
| `api/src/services/workflowStepTasks/create.ts` | Creates individual task |
| `api/src/services/workflowStepTasks/update.ts` | completeWorkflowStepTask (transactional, handles email/issue) |
| `api/db/schema.prisma` | Prisma schema with all models and enums |

## What Tests Exist

- Only directive tests (`requireAuth.test.ts`, `skipAuth.test.ts`). No component or service tests.

## Known Gaps / Extension Points

- No auth (everything is `@skipAuth`, auth stubs return true)
- No pagination on records list
- No search/filter on records
- Seed script is empty
- No loading skeletons (just text "Loading...")
- Email workspace creates email records but no actual email sending
- No undo/rollback on workflow steps
- Record status doesn't transition to `InProgress` when first step starts
- Each step creates exactly one task (1:1 relationship effectively, though schema supports many)
- No validation on record creation (empty steps array technically possible from API)

## Design System Opportunities (Observed Gaps)

These are areas where the codebase could benefit from design-system-level improvements:

### Modal (web/src/components/Modal/Modal.tsx)
- No focus trap (focus can tab behind the modal)
- No Escape key to close
- No focus restoration to trigger element on close
- No aria-labelledby or aria-describedby
- No animation on open/close
- Not headless (tightly couples backdrop + panel styling)

### Status Pills (RecordStatusPill, WorkflowStatusPill)
- Two separate components that share 90% of their logic
- Could be a single generic StatusPill with variant configuration
- No aria-label (screen readers just read the text, but context like "Status: Submitted" would be better)

### Buttons
- No shared Button component. Every button is raw <button> with repeated Tailwind classes.
- Inconsistent disabled styles across components.
- No consistent sizing system (some are px-3 py-2, others px-4 py-2).

### Table (RecordsPage)
- No cursor-pointer on clickable rows
- No role="button" or keyboard handler on clickable tr elements (accessibility gap)
- No sorting, no filtering
- No responsive behavior for small screens

### Forms (SendEmailWorkspace)
- Labels properly associated via htmlFor (good)
- No validation feedback (no error states shown)
- No loading/submitting state indication on the form itself

### General
- No consistent spacing scale enforced across components
- No shared color tokens (colors are Tailwind defaults, not a custom theme)
- No transition/animation on state changes

## CRITICAL: Database Safety

- NEVER run `yarn rw prisma migrate dev` or `yarn mig` during active development with data in the database. It will prompt to reset and DELETE all data.
- ALWAYS use `yarn rw prisma db push` for schema changes. It applies changes without resetting.
- After `db push`, run `yarn rw prisma generate` then `yarn gql` to regenerate types.
- The safe sequence for schema changes is:
  1. Edit api/db/schema.prisma
  2. yarn rw prisma db push
  3. yarn rw prisma generate
  4. yarn gql