# Quickstart: Theme Initialization Without Hydration Errors

## Prerequisites

- Install dependencies with the repository's existing `pnpm install` setup.
- Use the configured Playwright Chromium browser.

## End-to-end validation

Run the focused shell E2E tests; Playwright starts the local Next.js server and API fixture through `playwright.config.ts`:

```bash
pnpm test:e2e tests/e2e/shell.spec.ts --workers=1
```

Expected results:

- Saved light and dark preferences render with the corresponding accessible switch label.
- Changing the theme persists across a reload.
- No browser console error or page error reports a script-rendering warning or hydration mismatch.

## Build validation

```bash
pnpm type-check
pnpm build
git diff --check
```

All commands should complete successfully. The fix requires no database, API, or environment setup.
