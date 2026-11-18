# Tasks: Theme Initialization Without Hydration Errors

**Input**: Design documents from `/specs/002-theme-hydration/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [quickstart.md](quickstart.md)

**Tests**: One focused Playwright regression is included because the user requested E2E validation with Playwright.

**Organization**: Tasks are grouped by the single independently testable user story.

## Phase 1: User Story 1 - Load the saved color theme (Priority: P1)

**Goal**: Visitors see their saved or system color theme, a matching accessible toggle label, and no script or initial-render errors.

**Independent Test**: Run `pnpm test:e2e tests/e2e/shell.spec.ts --workers=1` and verify the saved light/dark cases, correct labels, persistence after reload, and no relevant browser console or page errors.

### Tests for User Story 1

- [X] T001 [US1] Add a Playwright regression in `tests/e2e/shell.spec.ts` for saved light/dark preferences, accessible toggle labels, persistence after reload, and script/hydration browser errors.

### Implementation for User Story 1

- [X] T002 [P] [US1] Replace `next/script` with the native pre-paint theme initializer in the root document `<head>` in `src/app/layout.tsx`, preserving guarded preference resolution and root hydration suppression.
- [X] T003 [P] [US1] Make initial state deterministic and initialize the saved/system theme before paint in `src/components/ThemeProvider.tsx`, preserving document class updates and cross-tab/system synchronization.
- [X] T004 [US1] Use provider readiness in `src/components/ThemeToggle.tsx` so icons, accessible label, and disabled state match on the server and the first browser render, then update to the resolved theme.

**Checkpoint**: User Story 1 passes the focused E2E regression with the existing theme-switching flow intact.

## Phase 2: Polish & Cross-Cutting Concerns

**Purpose**: Verify the approved implementation and record the result.

- [X] T005 Validate the theme flow covered by `tests/e2e/shell.spec.ts` with Playwright Browser, then run type-check, build, targeted lint/format checks, and `git diff --check`; record the local test-runner limitation below.

**Validation note**: Playwright Browser verified the saved-dark initial theme and accessible label, switching to light, persistence after reload, and zero browser errors. `pnpm type-check`, `pnpm build`, targeted ESLint/Prettier, and `git diff --check` passed. The repository Playwright server now uses the production build to avoid dev watcher exhaustion. The test command started the server but could not launch Chromium because its executable is absent; both Turbopack and webpack dev servers hit `EMFILE` in this environment.

## Dependencies & Execution Order

### Phase Dependencies

- **User Story 1**: Independent; can begin immediately after this plan is approved.
- **Polish**: Depends on T001–T004 being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories.

### Within User Story 1

- T001 is written first to capture the failing behavior.
- T002 and T003 can be implemented in parallel after T001 because they change separate files.
- T004 follows T003 because it consumes the provider readiness state.
- T005 follows all implementation tasks.

## Parallel Execution Examples

```text
After T001:
  T002: src/app/layout.tsx
  T003: src/components/ThemeProvider.tsx

After T003:
  T004: src/components/ThemeToggle.tsx
```

## Implementation Strategy

1. Add the single focused E2E regression and confirm it reproduces the reported saved-theme mismatch.
2. Replace the inline script renderer and make provider initialization deterministic.
3. Update the toggle to wait for the provider's resolved preference.
4. Run the E2E regression and the listed quality checks.
