# Simple GovWell

## Overview

Simple GovWell is a minimal RedwoodJS app for managing records through step‑based workflows with a React front end and a GraphQL API.

Technologies:
- RedwoodJS: RedwoodJS is a full‑stack framework that connects the React web side, the GraphQL API side, and a Prisma‑backed database using a single CLI and an opinionated project structure.
- React: React is a declarative component library used to build the web application's user interface with JSX and hooks.
- Tailwind: Tailwind CSS lets you style elements by adding simple class names in your markup (e.g., `p-4` for padding, `flex` for layout), so you can design without writing custom CSS.
- GraphQL: GraphQL is a typed query language and runtime that lets the web side fetch exactly the data it needs from the API via a well‑defined schema.
- Prisma: Prisma is a type‑safe ORM that defines the data model, applies database migrations, and generates a client for database access in the API.
- SQLite: SQLite is a lightweight embedded relational database used for local development, stored at `api/db/dev.db`.

## Setup

Prerequisites: Node.js 20.x and Yarn.

```
yarn
yarn mig
yarn gql
yarn rw dev
```

- `yarn`: Installs all dependencies across the monorepo workspaces (`api` and `web`) using Yarn Workspaces.
- `yarn mig`: Applies Prisma migrations to the development SQLite database and regenerates the Prisma Client; if configured, it also runs the seed script.
- `yarn gql`: Generates type‑safe GraphQL TypeScript definitions for both sides at `api/types/graphql.d.ts` and `web/types/graphql.d.ts`.
- `yarn rw dev`: Starts both the API GraphQL server and the Vite‑powered web dev server with hot reload, available at http://localhost:8910.

## System Architecture

- **Record**: Top‑level entity representing a case, permit, business license, etc that is being processed by the government jurisdiction. A `Record` has many `WorkflowSteps`.
- **WorkflowStep**: A stage in the record’s lifecycle. Fields include `order` (0‑based index), `type` (`Review`, `SendEmail`, `IssueRecord`), and `status` (`Pending`, `Completed`). Each `WorkflowStep` belongs to a single `Record` and has many `WorkflowStepTasks`.
- **WorkflowStepTask**: A single actionable work item inside a workflow step. Fields include `order`, `type`, and `status`. Each task belongs to a single `WorkflowStep`.

### Relationships
  - One `Record` → many `WorkflowSteps` (`recordId` foreign key on `WorkflowStep`).
  - One `WorkflowStep` → many `WorkflowStepTasks` (`workflowStepId` foreign key on `WorkflowStepTask`).

## Repository Structure

### Frontend (`web/src`)
 - `components/`: Reusable UI components and feature‑scoped groups (modals, pills, sections).
 - `fetch/`: Thin wrappers for invoking GraphQL queries and mutations from the web side.
 - `fragments/`: Shared GraphQL fragments reused across operations.
 - `hooks/`: Custom React hooks for UI state and behaviors.
 - `layouts/`: Route layouts that wrap pages with shared UI and logic.
 - `pages/`: Top‑level route screens composed from components and data.
 - `utils/`: Client‑side utilities for dates, formatting, and workflow helpers.

### API (`api/src`)
 - `directives/`: GraphQL schema directives (e.g., `requireAuth`, `skipAuth`) enforcing field‑level behavior.
 - `functions/`: Serverless‑style handlers including the GraphQL function entry point.
 - `graphql/`: SDL files that define types, queries, and mutations.
 - `lib/`: Shared server libraries like auth, database client, and logger.
 - `services/`: Business logic and data access used by GraphQL resolvers.

### Database (`api/db/`)
 - `schema.prisma`: Prisma definition file for our DB model definitions.
 - `migrations/`: Prisma migration history with timestamped folders.
