---
description: "Tasks for restoring production API runtime dependencies"
---

# Tasks: Restore Production API Runtime Dependencies

**Input**: Design documents from `specs/001-fix-api-packaging/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated test tasks were requested; use the production build and artifact inspection defined in the plan.

## Phase 1: Setup and SDD Backfill

**Purpose**: Record the confirmed failure and bounded remediation.

- [X] T001 Create the specification, research, plan, runtime contract, and quickstart records under `specs/001-fix-api-packaging/`.

## Phase 2: Foundational

No new runtime foundation is required. The existing Next.js standalone deployment, cPanel environment, PostgreSQL pool, and API routes remain in place.

## Phase 3: User Story 1 - Complete a Quote Request (Priority: P1)

**Goal**: Restore quote lookup routes in the production standalone application.

**Independent Test**: The production build completes and the standalone route bundle no longer requires the unavailable hashed `pg-<hash>` package alias.

### Implementation

- [X] T002 [US1] Change the `build` script in `package.json` to run `next build --webpack` and add `babel-plugin-react-compiler` as a dev dependency so the cPanel runtime resolves the declared `pg` package by its normal name while React Compiler remains enabled.
- [X] T003 [US1] Remove `experimental.turbopackRustReactCompiler` from `next.config.ts` while retaining `reactCompiler: true` for the Babel implementation.
- [X] T004 [US1] Run `pnpm build` and inspect `.next/standalone/.next/server/chunks` to confirm the route bundle no longer imports a hashed `pg-<hash>` alias and the standalone output completes successfully.
- [ ] T005 [US1] After the approved production release, request `/api/health`, `/api/quotes/measures`, `/api/quotes/countries`, and `/api/products` and confirm each returns its application-managed response without a Passenger module-resolution error.

## Dependencies

- T001 is complete.
- T003 depends on T002.
- T004 depends on T003.
- T005 depends on a release of the updated standalone artifact.

## Parallel Opportunities

- None; artifact inspection depends on the updated production build.

## Implementation Strategy

Apply the production bundler and compatible React Compiler configuration, then build and inspect the generated standalone artifact. Complete T005 after the updated artifact is released. No database, API route, deployment secret, or cPanel environment changes are in scope.
