# Feature Specification: Theme Initialization Without Hydration Errors

**Feature Branch**: `002-theme-hydration`

**Created**: 2026-11-15

**Status**: Implemented — Playwright Browser flow passed; repository test runner unavailable because local Chromium is missing

**Input**: Fix the reported inline script warning and theme-toggle server/client rendering mismatch using official framework guidance.

## User Scenarios & Testing

### User Story 1 - Load the saved color theme (Priority: P1)

A visitor who has chosen light or dark mode sees that preference applied on page load, and the theme control announces the action it will perform.

**Why this priority**: A theme preference that causes a page error or a misleading accessible label breaks the existing public-site shell on every initial visit where a saved preference differs from the default.

**Independent Test**: Open the site with a saved dark preference, verify the dark theme and the “switch to light mode” control label, and confirm the browser reports neither a script-rendering warning nor a server/client rendering mismatch.

**Acceptance Scenarios**:

1. **Given** a visitor has saved dark mode, **When** the visitor loads a page, **Then** dark mode is applied and the theme control announces that it switches to light mode.
2. **Given** a visitor has saved light mode, **When** the visitor loads a page, **Then** light mode is applied and the theme control announces that it switches to dark mode.
3. **Given** a visitor changes the theme, **When** the visitor reloads the page, **Then** the chosen theme remains active and the control announces the opposite action.
4. **Given** either theme preference, **When** the page becomes interactive, **Then** no script-rendering warning or server/client rendering mismatch is reported.

### Edge Cases

- If browser storage is unavailable or contains an unsupported value, the site falls back to the visitor's system preference without failing to render.
- A visitor with no saved preference receives the system color preference on first load.

## Requirements

### Functional Requirements

- **FR-001**: The site MUST apply a saved light or dark preference before the page's first paint.
- **FR-002**: The theme control MUST render consistently in the server response and the browser's initial render.
- **FR-003**: After initialization, the theme control MUST expose an accessible label that describes the theme it will switch to.
- **FR-004**: Changing the theme MUST continue to persist the preference and update the page theme.
- **FR-005**: Missing, invalid, or inaccessible browser storage MUST fall back safely to the system preference.
- **FR-006**: Normal page loads MUST complete without script-rendering warnings or server/client rendering errors caused by theme initialization.

### Key Entities

- **Theme preference**: The visitor's light, dark, or system choice. Existing browser-side persistence remains the source of the saved preference; no database or API data changes are introduced.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Automated browser checks verify saved light and dark preferences, matching accessible labels, persisted changes after reload, and no relevant browser errors.
- **SC-002**: The existing theme-switching journey continues to work.
- **SC-003**: Existing code-quality and release-build checks complete without errors after implementation.

## Assumptions

- The existing theme choices, translation strings, storage key, and user-facing design remain unchanged.
- The fix is limited to initialization and initial hydration of the existing theme shell.
- The current rendering framework and version remain unchanged.
