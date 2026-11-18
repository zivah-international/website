# Implementation Plan: Theme Initialization Without Hydration Errors

**Branch**: `002-theme-hydration` | **Date**: 2026-11-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-theme-hydration/spec.md`

## Summary

Preserve the saved or system color preference before first paint while ensuring the theme control has identical server and initial browser output. Replace the inline `next/script` component with the native inline script pattern documented for the App Router, initialize React theme state after the matching first render, and cover both saved preferences with Playwright.

## Technical Context

**Language/Version**: TypeScript 6, React 19, Next.js 16.4.6 App Router

**Primary Dependencies**: Existing Next.js, React, next-intl, lucide-react, and Playwright dependencies; no new packages

**Storage**: Existing `localStorage` key `theme`; no database or API changes

**Testing**: Playwright E2E in Chromium, `pnpm type-check`, `pnpm build`

**Target Platform**: Browser clients and standalone Node.js deployment on cPanel

**Project Type**: Single Next.js web application

**Performance Goals**: Apply the chosen theme before first paint; add no network requests or hydration-blocking dependencies

**Constraints**: Preserve existing theme values, system preference behavior, translated labels, static rendering, and `.env.local`; do not add UI libraries or change database/API contracts

**Scale/Scope**: Root layout, shared theme provider and toggle, and the existing shell E2E spec

## Constitution Check

**Pre-design gate — PASS**

- The change stays within the existing Next.js App Router application and standalone cPanel deployment.
- No database, API, authentication, credentials, or environment configuration changes are needed.
- Existing translations and theme UI are reused; no competing UI dependency is introduced.
- Validation uses the repository's `pnpm` commands and Playwright harness.

**Post-design gate — PASS**

- The inline initializer is server-rendered in the existing root layout and does not opt the application out of static rendering.
- The client provider owns the existing browser preference and system-theme synchronization; no new persistence contract is introduced.
- Browser E2E coverage is explicitly requested by the user and remains limited to this regression.

## Design Decisions

1. Use a native inline `<script>` in the root layout's `<head>` for pre-paint theme selection. Keep the existing guarded `localStorage` and media-query logic and the root `suppressHydrationWarning` behavior. This follows the installed Next.js 16.4.6 `preventing-flash-before-hydration` guide.
2. Make the theme provider's initial React state deterministic on server and browser. Read local storage and the current system preference in a client layout effect, apply that resolved theme there, and expose readiness so the toggle keeps a stable fallback label and icon until the preference is known.
3. Preserve the existing storage key, storage-event synchronization, system-preference listener, theme classes, `colorScheme`, and translated labels.
4. Add E2E coverage for saved light and dark preferences, accessible toggle names, theme persistence after reload, and absence of script/hydration browser errors.

## Project Structure

### Documentation

```text
specs/002-theme-hydration/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code

```text
src/app/layout.tsx                 # Pre-paint theme initialization in the root document
src/components/ThemeProvider.tsx   # Stable initial state and client theme initialization
src/components/ThemeToggle.tsx     # Hydration-safe icon and accessible label
tests/e2e/shell.spec.ts            # Saved theme, label, persistence, and browser-error regression checks
```

**Structure Decision**: Keep the fix in the existing application shell and its existing Playwright E2E suite. No new application modules, dependencies, endpoints, or data structures are needed.

## Complexity Tracking

No constitution violations or additional architectural components are introduced.
