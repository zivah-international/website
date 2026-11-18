# Research: Theme Initialization Without Hydration Errors

## Decisions

### 1. Keep the pre-paint theme initializer as a native inline script in the root document

**Decision**: Render the theme initializer as a native `<script>` in the root App Router layout's `<head>`, with guarded access to browser storage and the system media preference.

**Rationale**: The official Next.js guide for preventing flashes before hydration uses this pattern for themes. It executes while the HTML is parsed, before first paint, and pairs it with `suppressHydrationWarning` on the root element whose theme class is changed. The current `next/script` component produces the reported React console warning for this inline script.

**Alternatives considered**:

- Keep `next/script` with `beforeInteractive`: the warning is present in the supplied browser output, and the official theme guide demonstrates a native inline script for this specific pre-paint task.
- Apply the preference only in `useEffect`: this avoids reading browser storage during the initial render, but can paint the default theme before updating it.

### 2. Keep initial client markup deterministic, then initialize the saved preference before paint

**Decision**: Initialize provider state to the same deterministic defaults for server rendering and the browser's first render. Read the saved preference and system theme in a client layout effect, apply the resolved theme, and expose readiness so `ThemeToggle` renders the same fallback icon and label until initialization completes.

**Rationale**: The official hydration-error guide identifies browser-only values such as `localStorage` during rendering as a cause of mismatches. The installed Next.js theme guide documents using an inline script for pre-paint DOM state; its development Strict Mode section recommends reapplying the theme in a layout effect after React remounts the root document. The current `useMounted` guard disables the button and `aria-label`, but the visually-hidden span and theme-dependent icon classes still change during the first browser render.

**Alternatives considered**:

- Suppress the mismatch on the control: this hides an error instead of making the initial render stable; Next.js documents this as an escape hatch and says it does not patch mismatched text.
- Disable server rendering for the control: this removes useful server-rendered navigation content and is broader than needed.

## Official References

- Next.js 16.4.6, [How to prevent flash before hydration — Themes](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration#themes): native inline script in the root `<head>`, `suppressHydrationWarning`, and reapplication in development.
- Next.js, [Text content does not match server-rendered HTML](https://nextjs.org/docs/messages/react-hydration-error): browser-only storage during rendering can produce mismatched server and client output; render consistently and read browser values after hydration.
- Next.js, [Script Component](https://nextjs.org/docs/app/api-reference/components/script): `beforeInteractive` placement and use are intended for critical scripts needed before the page becomes interactive.
