# Public Site Seafood-First Redesign — Implementation Plan

> **For the implementing engineer:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Do not batch tasks: each task ends with a green test run and a commit.

**Goal:** Rebuild the ZIVAH public marketing site so it reads as an institutional seafood and aquaculture exporter, with one conversion path: an FOB quote request. The result must feel editorial, calm, and modern, not like a product marketplace template.

**Architecture:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Radix UI, and `next-intl`. The public site lives under `src/app/[locale]`; admin and API routes are not redesigned. Home and static marketing sections become server components. The product catalog stays a client component because it has local filtering. Product detail and the technical sheet stay server-rendered from the existing API. Tests use Playwright with browser-level API mocks plus a stub API server for server-rendered product routes, so no PostgreSQL server is required.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI (`@radix-ui/react-dialog` via `src/components/ui/sheet.tsx`), `next-intl`, `next/font` (Newsreader + Inter), Playwright Test, `@axe-core/playwright`.

**Spec:** `docs/superpowers/specs/2026-10-20-public-site-redesign-design.md`

---

## Working rules

- Read this plan one task at a time. Write the test first, run it red, implement only enough to pass, run it green, then commit.
- Use `pnpm` for every command.
- Do **not** change `src/app/admin`, `src/app/api`, `prisma/`, auth logic, or database access.
- Do **not** commit `AGENTS.md`. It is modified by `next dev` and is intentionally left dirty. Always stage explicit paths, never `git add -A`.
- Do **not** use emoji as icons. Do not introduce a second UI library. Reuse Radix and `src/components/ui/*`.
- Keep Spanish neutral with `tú`. No voseo. English must mirror every new key.
- Use `Link` from `@/i18n/routing` for every public internal link so `/en` keeps its prefix. Do not use `next/link` inside `src/app/[locale]`.
- One primary action per view. The only solid accent button on a screen is the conversion action.
- For link-shaped buttons, use `<Button asChild><Link …>…</Link></Button>`; never nest a `<button>` inside an `<a>`.
- Business metrics must come from `src/lib/public-data.ts` and the `metrics` translation namespace. Never hardcode a different market or certification count.
- Do not stage `.next/`, `node_modules/`, `.env*`, `test-results/`, or `playwright-report/`.

### Test environment

- Playwright starts Next dev on **port 3100**, so it never collides with a dev server on 3000.
- Product detail server fetches use `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:4010`, served by `tests/fixtures/api-stub.mjs`.
- Browser pages are mocked with `page.route()` for `/api/categories`, `/api/products`, `/api/quotes/*`.
- Add `test-results/` and `playwright-report/` to `.gitignore`.
- Run one test file while iterating: `pnpm test:e2e tests/e2e/home.spec.ts`.
- Stop any manually started dev server on ports 3100/4010 before running the suite.

---

## Task 1: Design tokens, fonts, and Playwright harness

**Files:**

- Create: `playwright.config.ts`
- Create: `tests/e2e/design-system.spec.ts`
- Modify: `package.json`
- Modify: `.gitignore`
- Modify: `.prettierignore`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/components/ui/button.tsx`

**Step 1: Add the Playwright harness**

Add to `package.json` scripts:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

Add to `.gitignore`:

```gitignore
# Playwright
test-results/
playwright-report/
blob-report/
```

Add the same directories to `.prettierignore` so `pnpm format:check` does not inspect Playwright traces or reports:

```gitignore
test-results/
playwright-report/
blob-report/
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  retries: 0,
  reporter: [['list']],
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://127.0.0.1:3100',
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'pnpm exec next dev --turbopack --port 3100',
      url: 'http://127.0.0.1:3100',
      reuseExistingServer: false,
      timeout: 180_000,
      env: { NEXT_PUBLIC_SITE_URL: 'http://127.0.0.1:4010' },
    },
  ],
});
```

**Step 2: Write the failing design-system test**

Create `tests/e2e/design-system.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('uses the approved paper, navy, accent, and 2px radius tokens', async ({ page }) => {
  await page.goto('/');

  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      background: styles.getPropertyValue('--background').trim(),
      foreground: styles.getPropertyValue('--foreground').trim(),
      accent: styles.getPropertyValue('--accent').trim(),
      radius: styles.getPropertyValue('--radius').trim(),
    };
  });

  expect(tokens).toEqual({
    background: '#F6F4EF',
    foreground: '#14202B',
    accent: '#C0451F',
    radius: '0.125rem',
  });
});

test('uses Newsreader for public display headings and Inter for body', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1').first()).toHaveCSS('font-family', /Newsreader/i);
  await expect(page.locator('p').first()).toHaveCSS('font-family', /Inter|__Inter/i);
});

test('dark mode swaps the public surface tokens', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.documentElement.classList.add('dark'));

  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
      )
    )
    .toBe('#0A1622');
});
```

**Step 3: Run the test and verify it fails**

```bash
pnpm test:e2e tests/e2e/design-system.spec.ts
```

Expected: FAIL. The current tokens are OKLCH, the h1 uses Montserrat/fallback, and the radius is not 2px.

**Step 4: Replace the color tokens**

In `src/app/globals.css`, set `:root` to the light palette:

```css
--radius: 0.125rem;
--surface: #ffffff;
--background: #f6f4ef;
--foreground: #14202b;
--card: var(--surface);
--card-foreground: #14202b;
--popover: var(--surface);
--popover-foreground: #14202b;
--primary: #0b2239;
--primary-foreground: #f6f4ef;
--secondary: #5c6a75;
--secondary-foreground: #ffffff;
--muted: #ede9e1;
--muted-foreground: #5c6a75;
--accent: #c0451f;
--accent-foreground: #ffffff;
--accent-hover: #a93a18;
--destructive: #a8261a;
--destructive-foreground: #ffffff;
--border: #d8d3c8;
--input: #d8d3c8;
--ring: #c0451f;
```

Set `.dark` to:

```css
--surface: #0f1e2c;
--background: #0a1622;
--foreground: #ece8df;
--card: var(--surface);
--card-foreground: #ece8df;
--popover: var(--surface);
--popover-foreground: #ece8df;
--primary: #071829;
--primary-foreground: #ece8df;
--secondary: #a9b6c0;
--secondary-foreground: #0a1622;
--muted: #152838;
--muted-foreground: #a9b6c0;
--accent: #f07048;
--accent-foreground: #0a1622;
--accent-hover: #f58a68;
--destructive: #f07048;
--destructive-foreground: #0a1622;
--border: rgba(255, 255, 255, 0.14);
--input: rgba(255, 255, 255, 0.18);
--ring: #f07048;
```

Keep the existing chart/sidebar variables but make chart 1–5 monochrome navy/slate/accent variants. Do not add new decorative colors.

In `@theme inline`, add:

```css
--color-surface: var(--surface);
--color-accent-hover: var(--accent-hover);
--font-sans: var(--font-inter), Inter, system-ui, sans-serif;
--font-serif: var(--font-newsreader), Newsreader, Georgia, serif;
```

Remove the unused `.text-brand-gradient` utility. Keep the reduced-motion rule. Add a public-scoped focus rule:

```css
.public-site :focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.public-site .prose-link {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
```

Use `prose-link` on links inside paragraphs (for example the agricultural secondary line and the CTA band’s email/WhatsApp links) so color is not the only affordance.

Add public typography, scoped so admin does not change. The wrapper has `display: contents`, so `font-family` here still inherits into every public child:

```css
.public-site {
  font-family: var(--font-inter), Inter, system-ui, sans-serif;
}

.public-site h1,
.public-site h2,
.public-site h3,
.public-site h4 {
  font-family: var(--font-newsreader), Newsreader, Georgia, serif;
  font-weight: 500;
  letter-spacing: -0.012em;
}

.public-site h1 {
  letter-spacing: -0.018em;
  line-height: 1.02;
}
```

Keep the existing global `h1..h6` Montserrat fallback for admin, but public headings override it.

Add print rules. Do **not** hide every `header` inside `.public-site`: the technical sheet has its own document header. Give the site chrome explicit classes (`site-header` on `Navigation`’s `<header>`, `site-footer` on `Footer`):

```css
@media print {
  .site-header,
  .site-footer,
  .no-print {
    display: none !important;
  }
  .public-site {
    background: #fff !important;
    color: #000 !important;
  }
}
```

**Step 5: Update Tailwind config for consistency**

In `tailwind.config.ts`:

- Map `fontFamily.sans` to `var(--font-inter)`.
- Replace `fontFamily.display` with `serif: ['var(--font-newsreader)', 'Newsreader', 'Georgia', 'serif']`.
- Set `borderRadius` to explicit `2px` values (`lg`, `md`, `sm`) so loading the legacy config cannot produce negative radii.
- Add `surface: 'var(--surface)'` and `accentHover: 'var(--accent-hover)'` to `colors`.

Do not rely on this file for Tailwind v4 tokens; `@theme inline` is the source of truth.

**Step 6: Load Newsreader and scope the public wrapper**

In `src/app/[locale]/layout.tsx`:

```ts
import { Inter, Newsreader } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});
```

If `next/font` rejects the variable-style declaration, add `weight: ['400', '500', '600']`; do not load additional families. Remove the `Montserrat` import and instance. Remove the Google Fonts `<link rel='preconnect'>`/stylesheet tags. Change the public wrapper to:

```tsx
<div className={`public-site ${inter.variable} ${newsreader.variable} contents`}>
```

Update `themeColor` to `#F6F4EF` for light and `#0A1622` for dark.

**Step 7: Add the brand button variants**

In `src/components/ui/button.tsx`, keep every existing variant and size. Add:

```ts
brand:
  'rounded-[2px] bg-accent text-accent-foreground hover:bg-[var(--accent-hover)]',
'brand-outline':
  'rounded-[2px] border border-primary/30 bg-transparent text-primary hover:border-primary hover:bg-primary/[0.04] dark:border-primary-foreground/30 dark:text-primary-foreground dark:hover:bg-white/[0.06]',
'brand-inverse':
  'rounded-[2px] bg-[#F6F4EF] text-[#0B2239] hover:bg-white',
'brand-ghost':
  'rounded-none px-0 text-primary underline-offset-4 hover:text-accent hover:underline dark:text-primary-foreground',
```

Add a `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring` to the base class. Brand buttons use `h-11 px-6 text-[11.5px] font-semibold tracking-[0.1em] uppercase`; small brand buttons use `h-9 px-4 text-[10.5px]`. Set touch targets to at least 44px everywhere.

**Step 8: Run the test and verify it passes**

```bash
pnpm test:e2e tests/e2e/design-system.spec.ts
pnpm type-check
```

Expected: 3 passing.

**Step 9: Format and commit**

```bash
pnpm exec prettier --write package.json .gitignore .prettierignore playwright.config.ts tests/e2e/design-system.spec.ts src/app/globals.css tailwind.config.ts 'src/app/[locale]/layout.tsx' src/components/ui/button.tsx
git add package.json .gitignore .prettierignore playwright.config.ts tests/e2e/design-system.spec.ts src/app/globals.css tailwind.config.ts 'src/app/[locale]/layout.tsx' src/components/ui/button.tsx
git commit -m "feat(public): add editorial design tokens and test harness"
```

---

## Task 2: Public shell — navigation, footer, theme, language, cookies

**Files:**

- Create: `src/components/site/PublicShell.tsx`
- Create: `src/lib/contact-info.ts`
- Create: `tests/e2e/shell.spec.ts`
- Modify: `src/components/Navigation.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/ThemeToggle.tsx`
- Modify: `src/components/LanguageSwitcher.tsx`
- Modify: `src/components/CookieConsent.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Delete: `src/components/WhatsAppButton.tsx`
- Modify: `src/messages/es.json`, `src/messages/en.json` (`nav`, `footer`, `cookies`)

**Step 1: Write the failing shell test**

Create `tests/e2e/shell.spec.ts` with a helper that suppresses the cookie banner:

```ts
import { expect, test, type Page } from '@playwright/test';

async function prepare(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  });
}

test('header exposes four sections and one quote action', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: /principal/i });
  await expect(nav.getByRole('link', { name: 'Productos' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Calidad' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Mercados' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Contacto' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Cotizar' })).toHaveCount(0);
  await expect(page.locator('header a[href="/quote"]')).toHaveCount(1);
});

test('footer has four quiet columns and no newsletter', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('heading', { name: 'Productos' })).toBeVisible();
  await expect(footer.getByRole('heading', { name: 'Compañía' })).toBeVisible();
  await expect(footer.getByRole('heading', { name: 'Contacto' })).toBeVisible();
  await expect(footer.getByText(/newsletter|suscríbete|suscribete/i)).toHaveCount(0);
});

test('no floating WhatsApp button remains', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  await expect(page.locator('a[href*="wa.me"].fixed')).toHaveCount(0);
});

test('language switcher shows ES/EN text without flags', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  await expect(page.getByLabel(/idioma/i)).toBeVisible();
  await expect(page.getByLabel(/idioma/i).locator('option')).toHaveText(['ES', 'EN']);
});

test('mobile drawer traps focus and closes with Escape', async ({ page }) => {
  await prepare(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('button', { name: /abrir menú/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Productos' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('skip link is the first focus target', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused();
});

test('theme toggle changes the document theme', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const toggle = page.getByRole('button', { name: /cambiar a (modo )?oscuro/i });
  await toggle.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
});
```

**Step 2: Run and verify failure**

```bash
pnpm test:e2e tests/e2e/shell.spec.ts
```

Expected: FAIL on navigation labels, flags, floating WhatsApp, drawer behavior, and theme label.

**Step 3: Create `PublicShell`**

Create `src/components/site/PublicShell.tsx`:

```tsx
import type { ReactNode } from 'react';

import Navigation from '@/components/Navigation';
import { cn } from '@/lib/utils';

export default function PublicShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <Navigation />
      <main id='main'>{children}</main>
    </div>
  );
}
```

**Step 4: Rewrite the navigation**

In `src/components/Navigation.tsx`:

- Items: `Productos`, `Calidad`, `Mercados`, `Contacto`. No Inicio, no duplicate Cotizar link.
- Add `className='site-header'` to the `<header>` for print hiding.
- Import `usePathname` from `@/i18n/routing` so it returns the path without the locale prefix.
- `isHome = pathname === '/'`.
- Transparent over the home hero only when `!isScrolled`; solid on every internal page. Header height 76px desktop, 64px mobile.
- Set header text to `text-primary-foreground` while transparent and `text-foreground` when solid. The theme toggle and language select use `text-current` and `border-current/25`, never hardcoded dark text, so both states remain visible.
- Desktop links: 13px Inter, uppercase tracking, active underline in accent; no icons.
- Right cluster: `LanguageSwitcher`, `ThemeToggle`, `Button variant='brand'` labelled **Solicitar cotización**. Hide the header CTA when `pathname.startsWith('/quote')`.
- Logo: local `zivah-logo.svg`, `h-9 w-auto`. On the transparent hero apply `brightness-0 invert`; on solid surfaces show the original. Do not put the logo in a white card.
- Mobile: use `Sheet`/`SheetContent` (Radix Dialog) from `src/components/ui/sheet.tsx`; side `right`, `bg-background`, visible `SheetTitle` “Menú”, four links, language, theme, CTA, legal links. Radix provides focus trap and Escape. Close on link click.
- Add a skip link as the first focusable element: `Saltar al contenido` → `#main`.
- Add `aria-label='Navegación principal'` to the nav.
- On scroll, add a hairline border, not a shadow.

**Step 5: Create the shared contact constants**

Create `src/lib/contact-info.ts` and use it from Footer, Contact, Quote, and structured data:

```ts
export const CONTACT_INFO = {
  email: 'sales@zivahinternational.com',
  phone: '+593 99 900 2893',
  phoneHref: 'tel:+593999002893',
  whatsapp:
    'https://wa.me/593999002893?text=Hola%2C%20me%20pongo%20en%20contacto%20desde%20la%20web%20de%20ZIVAH%20International.',
  ecuador: 'Samborondón, Guayas',
  miami: 'Miami, Florida',
  directions:
    'https://www.google.com/maps/search/?api=1&query=Samborond%C3%B3n%2C%20Guayas%2C%20Ecuador',
} as const;
```

**Step 6: Rewrite the footer**

In `src/components/Footer.tsx`, add `className='site-footer'` to the `<footer>` and render four columns on `lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]` over `bg-surface` with a top hairline. Use `<h2>`/`<h3>` for the column titles so the footer is navigable by headings:

1. **Brand:** logo, one line “Exportador de productos del mar y acuicultura desde Ecuador.”, social icons (monochrome, `aria-label`, 44px targets).
2. **Productos:** Camarón blanco, Larvas de camarón, Atún fresco, Ver catálogo. Agricultural line in small text: “Frutas tropicales, café y cacao”.
3. **Compañía:** Calidad, Mercados, Contacto, Solicitar cotización.
4. **Contacto:** Samborondón, Ecuador / Miami, FL; `sales@zivahinternational.com`; `+593 99 900 2893`; hours from `footer.hours` (“Lun–Vie · 09:00–18:00 GMT-5” / “Mon–Fri · 09:00–18:00 GMT-5”).

Below: one legal row with Privacy, Terms, Cookies, Data protection, and `© {year} ZIVAH International S.A.` Remove newsletter and duplicated navigation columns.

**Step 7: Simplify theme and language controls**

`ThemeToggle.tsx`:

- Use monochrome sun/moon SVGs (or `lucide-react` icons already in the project), 20px, `stroke='currentColor'`, `text-current`.
- 44×44 button, `border-current/25`, transparent background, no gradients, no amber/secondary colors.
- `aria-label` from `nav.switchToDark` / `nav.switchToLight`; keep the `useMounted` guard.

`LanguageSwitcher.tsx`:

- Collapse the unused `buttons`/`dropdown` variants to a single compact `select`; Navigation is the only caller and uses the default.
- Remove `localeFlags`/`localeNames` imports and all flag rendering.
- `select` options: `ES`, `EN`, styled `text-current` with `border-current/25` so it works on navy and paper.
- Add `aria-label` from `nav.language`.
- Keep the existing locale cookie/localStorage behavior and routing.

**Step 8: Restyle the cookie banner**

`CookieConsent.tsx`:

- Banner: fixed bottom-right desktop, bottom full-width mobile; `max-w-[420px]`, `border border-border`, `bg-surface`, 2px radius, restrained shadow, `p-5`.
- Add `role='dialog'`, `aria-label` from `cookies.title`.
- Buttons: `brand` (accept), `brand-outline` (configure), `brand-ghost` (reject). 44px minimum.
- Preferences panel: keep the existing consent logic; replace emoji close control with a 44px `X` icon button. Use tokens, hairline borders, no tinted cards.
- Do not change consent storage keys or analytics behavior.

**Step 9: Remove the floating WhatsApp button**

- Remove the `WhatsAppButton` import and render from `src/app/[locale]/layout.tsx`.
- Delete `src/components/WhatsAppButton.tsx`.
- WhatsApp remains as a text link in Contact, Quote, and Footer only.

**Step 10: Add/update messages**

Add to `nav` in both locales:

```json
"mainLabel": "Navegación principal",
"openMenu": "Abrir menú",
"closeMenu": "Cerrar menú",
"skipToContent": "Saltar al contenido",
"switchToDark": "Cambiar a modo oscuro",
"switchToLight": "Cambiar a modo claro",
"quoteCta": "Solicitar cotización"
```

English mirror: “Main navigation”, “Open menu”, “Close menu”, “Skip to content”, “Switch to dark mode”, “Switch to light mode”, “Request a quote”.

Add/update `footer` keys for the four columns, the localized `hours` line, and the legal row. Remove `newsletter` copy from `footer`. Keep `cookies` keys but rewrite labels to short, neutral Spanish.

**Step 11: Run and verify**

```bash
pnpm test:e2e tests/e2e/shell.spec.ts
pnpm type-check
```

Expected: 7 passing. The floating WhatsApp assertion must be exact: assert count 0, not a sentinel count.

**Step 12: Format and commit**

```bash
pnpm exec prettier --write src/components/site/PublicShell.tsx src/lib/contact-info.ts src/components/Navigation.tsx src/components/Footer.tsx src/components/ThemeToggle.tsx src/components/LanguageSwitcher.tsx src/components/CookieConsent.tsx 'src/app/[locale]/layout.tsx' src/messages/es.json src/messages/en.json tests/e2e/shell.spec.ts
git add src/components/site/PublicShell.tsx src/lib/contact-info.ts src/components/Navigation.tsx src/components/Footer.tsx src/components/ThemeToggle.tsx src/components/LanguageSwitcher.tsx src/components/CookieConsent.tsx 'src/app/[locale]/layout.tsx' src/messages/es.json src/messages/en.json tests/e2e/shell.spec.ts
git rm src/components/WhatsAppButton.tsx
git commit -m "feat(public): rebuild navigation and footer shell"
```

---

## Task 3: Home hero, evidence bar, seafood plates

**Files:**

- Create: `src/components/site/SectionHeader.tsx`
- Create: `src/components/site/EvidenceBar.tsx`
- Create: `src/components/site/ProductCard.tsx`
- Create: `src/components/site/SecondaryLines.tsx`
- Create: `src/components/sections/Hero.tsx`
- Create: `src/components/sections/SeafoodLinesSection.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Create: `public/assets/images/photos/hero-marine.jpg`
- Create: `public/assets/images/photos/product-camaron.jpg`
- Create: `public/assets/images/photos/product-larvas.jpg`
- Create: `public/assets/images/photos/product-atun.jpg`
- Create: `src/lib/public-data.ts`
- Modify: `src/messages/es.json`, `src/messages/en.json`
- Create: `tests/e2e/home.spec.ts`

**Step 1: Download the four home photos locally**

```bash
mkdir -p public/assets/images/photos
curl -L 'https://images.pexels.com/photos/14062141/pexels-photo-14062141.jpeg?auto=compress&cs=tinysrgb&w=1920&q=82' -o public/assets/images/photos/hero-marine.jpg
curl -L 'https://images.pexels.com/photos/2714384/pexels-photo-2714384.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80' -o public/assets/images/photos/product-camaron.jpg
curl -L 'https://images.pexels.com/photos/11048741/pexels-photo-11048741.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80' -o public/assets/images/photos/product-larvas.jpg
curl -L 'https://images.pexels.com/photos/14062107/pexels-photo-14062107.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80' -o public/assets/images/photos/product-atun.jpg
file public/assets/images/photos/*.jpg
```

Expected: four JPEG files. Do not substitute the old Unsplash `1559827260` (it is a wave, not shrimp) or `1544551763` (a diver, not tuna).

**Step 2: Write the failing home-top test**

Create `tests/e2e/home.spec.ts`:

```ts
import { expect, test, type Page } from '@playwright/test';

async function prepare(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  });
}

test('hero leads with seafood and one FOB quote action', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Productos del mar ecuatorianos, listos para exportar.'
  );
  await expect(page.getByRole('link', { name: 'Solicitar cotización FOB' })).toHaveAttribute(
    'href',
    '/quote'
  );
  await expect(page.getByRole('link', { name: 'Ver productos del mar' })).toHaveAttribute(
    'href',
    '#productos-del-mar'
  );
  await expect(page.locator('[aria-label*="anterior" i], [aria-label*="siguiente" i]')).toHaveCount(
    0
  );
});

test('evidence bar uses the shared metrics', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const evidence = page.getByTestId('evidence-bar');
  await expect(evidence).toContainText('6 mercados');
  await expect(evidence).toContainText('4 activos');
  await expect(evidence).toContainText('24 h');
  await expect(evidence).toContainText('4 certificaciones');
  await expect(evidence).toContainText('100%');
});

test('three seafood plates appear before the agricultural strip', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const cards = page.getByTestId('seafood-card');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText('Camarón Blanco Premium');
  await expect(cards.nth(1)).toContainText('Larvas de camarón Post-Larva');
  await expect(cards.nth(2)).toContainText('Atún Fresco del Pacífico');
  await expect(page.getByTestId('secondary-lines')).toContainText(
    'También exportamos frutas tropicales'
  );
  await expect(page.locator('section#productos-del-mar')).toHaveCount(1);
});

test('hero uses a local image and no remote hosts', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const hero = page.getByTestId('hero');
  const image = hero.locator('img');
  await expect(image).toHaveAttribute('src', /hero-marine\.jpg/);
});
```

**Step 3: Run and verify failure**

```bash
pnpm test:e2e tests/e2e/home.spec.ts
```

Expected: FAIL on H1, hero, evidence, seafood cards, local image.

**Step 4: Create `public-data.ts`**

Create `src/lib/public-data.ts` with the single source of truth:

```ts
export const CERTIFICATIONS = [
  { code: 'BAP', name: 'Best Aquaculture Practices', scope: 'seafood' },
  { code: 'HACCP', name: 'Hazard Analysis Critical Control Points', scope: 'both' },
  { code: 'BRC', name: 'British Retail Consortium', scope: 'seafood' },
  { code: 'MSC', name: 'Marine Stewardship Council', scope: 'seafood' },
] as const;

export const MARKETS = [
  { code: 'US', status: 'active', cityKey: 'miami', x: 27, y: 40 },
  { code: 'JP', status: 'active', cityKey: 'tokyo', x: 82, y: 40 },
  { code: 'NL', status: 'active', cityKey: 'rotterdam', x: 49, y: 27 },
  { code: 'CN', status: 'active', cityKey: 'shanghai', x: 75, y: 46 },
  { code: 'CA', status: 'expansion', cityKey: 'toronto', x: 22, y: 30 },
  { code: 'AE', status: 'expansion', cityKey: 'dubai', x: 63, y: 48 },
] as const;

export const METRICS = {
  totalMarkets: MARKETS.length,
  activeMarkets: MARKETS.filter(market => market.status === 'active').length,
  certifications: CERTIFICATIONS.length,
  responseHours: 24,
  traceability: '100%',
} as const;
```

**Step 5: Build the home top as server components**

`Hero.tsx`:

- `<section data-testid='hero' aria-labelledby='home-title'>`.
- Fixed header offset. Desktop `min-h-[700px]`; mobile `min-h-[560px] h-[72svh]`.
- `<Image src='/assets/images/photos/hero-marine.jpg' fill priority sizes='100vw' className='object-cover' />` with localized meaningful alt text: “Camarón blanco ecuatoriano listo para exportación” / “Ecuadorian white shrimp ready for export”.
- Navy scrim `bg-[#071829]/70` plus a left-to-right gradient for text contrast. Do not use a flat full-bleed black overlay.
- Content container max 1200px, aligned left, max width 720px.
- Eyebrow 11px uppercase tracking 0.18em, warm tint `#F3B39C`.
- H1 `text-[clamp(2.75rem,6vw,4.5rem)]`, white; italic emphasis on “listos para exportar” using `#F3B39C`.
- Lead 17–19px, max 56ch, `text-white/80`.
- Buttons: brand primary “Solicitar cotización FOB” and brand-inverse/outline “Ver productos del mar”.
- Small caption bottom-right desktop: “Camarón blanco · Guayas, Ecuador”.
- No slider state, no autoplay, no side panel.

`EvidenceBar.tsx`:

- `<dl data-testid='evidence-bar'>` with 4 columns desktop, 2×2 mobile.
- Values in Newsreader 32–40px; labels in 11px uppercase Inter.
- Items: `{count} mercados` / `4 activos`; `24 h` / `Respuesta comercial`; `4 certificaciones` / `BAP · HACCP · BRC · MSC`; `100%` / `Trazabilidad por lote`.
- Use `METRICS` and `t('metrics...', { count })`, not literals.
- Hairline top/bottom, surface background, no colored icons.

`SeafoodLinesSection.tsx`:

- `<section id='productos-del-mar' className='scroll-mt-24'>` with `SectionHeader`.
- H2: “Tres líneas. Un mismo estándar de exportación.”
- Lead: “Camarón, larvas y atún. Cada lote sale con documentación verificable y cadena de frío controlada.”
- Three `article data-testid='seafood-card'` in a 3/2/1 grid. No heavy shadows; hairline border, surface, 2px radius.
- Each card: `next/image` 4:3 local image, category eyebrow, serif H3, one-line description, link “Ver ficha” → `/products/<slug>`.
- Products:
  - `camaron-blanco-premium` — Camarón Blanco Premium — image `product-camaron.jpg`
  - `larvas-camaron-postlarva` — Larvas de camarón Post-Larva — image `product-larvas.jpg`
  - `atun-fresco-pacifico` — Atún Fresco del Pacífico — image `product-atun.jpg`
- Descriptions:
  - Camarón: “Camarón vannamei IQF, calibres 16/20 a 41/50. Empaque a medida para distribución y retail.”
  - Larvas: “Post-larvas PL10–PL15 con trazabilidad genética y soporte técnico de siembra.”
  - Atún: “Lomos y steak de atún, cadena de frío desde puerto. Disponibilidad sujeta a temporada.”
- Below the grid, one quiet text line with `SecondaryLines`: “También exportamos **frutas tropicales**, **café de altura** y **cacao**.” Links go to `/products?category=agricolas` and use the `prose-link` class. No images, cards, or second grid. The wrapper carries `data-testid='secondary-lines'`.

`SectionHeader.tsx` props:

```ts
type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
};
```

**Step 6: Replace the home top**

In `src/app/[locale]/page.tsx`, remove `'use client'`, `HeroSlider`, and the old upper sections. Render:

```tsx
<PublicShell>
  <Hero />
  <EvidenceBar />
  <SeafoodLinesSection />
</PublicShell>
```

Keep the old lower sections temporarily only if the build needs a complete page; otherwise leave the page intentionally incomplete until Task 4. Do not render `NewsletterSection`.

**Step 7: Add messages**

Add `home` keys for hero, evidence, seafood cards, and secondary strip. Add a `metrics` namespace used by Home, Quality, and Markets:

```json
"metrics": {
  "markets": "{count} mercados",
  "activeMarkets": "{count} activos",
  "certifications": "{count} certificaciones",
  "response": "24 h",
  "traceability": "100%"
}
```

English: `{count} markets`, `{count} active`, `{count} certifications`, `24 h`, `100%`.

Spanish hero copy:

- Eyebrow: “Ecuador · Exportación directa”
- H1: “Productos del mar ecuatorianos, listos para exportar.”
- Lead: “Camarón blanco, larvas de camarón y atún del Pacífico con documentación lista, trazabilidad por lote y respuesta comercial en 24 horas.”
- Primary: “Solicitar cotización FOB”
- Secondary: “Ver productos del mar”
- Caption: “Camarón blanco · Guayas, Ecuador”

English hero copy:

- Eyebrow: “Ecuador · Direct export”
- H1: “Ecuadorian seafood, ready for export.”
- Lead: “White shrimp, shrimp post-larvae, and Pacific tuna with export-ready documentation, batch traceability, and a commercial response within 24 hours.”
- Primary: “Request an FOB quote”
- Secondary: “View seafood”
- Caption: “White shrimp · Guayas, Ecuador”

**Step 8: Run and verify**

```bash
pnpm test:e2e tests/e2e/home.spec.ts
pnpm test:e2e tests/e2e/design-system.spec.ts
```

Expected: home-top tests pass; design-system tests still pass.

**Step 9: Format and commit**

```bash
pnpm exec prettier --write src/lib/public-data.ts src/components/site src/components/sections/Hero.tsx src/components/sections/SeafoodLinesSection.tsx 'src/app/[locale]/page.tsx' src/messages/es.json src/messages/en.json tests/e2e/home.spec.ts
git add src/lib/public-data.ts src/components/site src/components/sections/Hero.tsx src/components/sections/SeafoodLinesSection.tsx 'src/app/[locale]/page.tsx' src/messages/es.json src/messages/en.json tests/e2e/home.spec.ts public/assets/images/photos/hero-marine.jpg public/assets/images/photos/product-camaron.jpg public/assets/images/photos/product-larvas.jpg public/assets/images/photos/product-atun.jpg
git commit -m "feat(home): lead with seafood hero and product plates"
```

---

## Task 4: Home proof, quality band, process, markets, testimonial, final CTA

**Files:**

- Create: `src/components/sections/WhyZivahSection.tsx`
- Create: `src/components/sections/QualityBand.tsx`
- Create: `src/components/sections/ProcessSection.tsx` (replace old file)
- Create: `src/components/sections/MarketsSection.tsx`
- Create: `src/components/sections/TestimonialSection.tsx`
- Create: `src/components/sections/FinalCta.tsx`
- Create: `src/components/site/CTABand.tsx`
- Create: `src/components/site/CertificationMark.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/messages/es.json`, `src/messages/en.json`
- Delete: `src/components/HeroSlider.tsx`
- Delete: `src/components/sections/FeatureSection.tsx`
- Delete: `src/components/sections/WhyEcuadorSection.tsx`
- Delete: `src/components/sections/CategoriesSection.tsx`
- Delete: `src/components/sections/TestimonialsSection.tsx`
- Delete: `src/components/sections/NewsletterSection.tsx`
- Delete: `src/lib/hooks/use-scroll-animation.ts` if unused
- Modify: `tests/e2e/home.spec.ts`

**Step 1: Append failing tests**

Add to `tests/e2e/home.spec.ts`:

```ts
test('home presents proof, process, markets, and one testimonial', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Por qué ZIVAH' })).toBeVisible();
  await expect(page.getByTestId('quality-band')).toContainText('BAP');
  await expect(page.getByTestId('quality-band')).toContainText('HACCP');
  await expect(page.getByTestId('quality-band')).toContainText('BRC');
  await expect(page.getByTestId('quality-band')).toContainText('MSC');
  await expect(page.getByTestId('quality-band')).toContainText('GlobalGAP');
  await expect(page.getByTestId('process-step')).toHaveCount(4);
  await expect(page.getByTestId('market-row')).toHaveCount(6);
  await expect(page.getByTestId('testimonial')).toHaveCount(1);
  await expect(
    page.getByText('Recibe una cotización FOB de productos del mar en 24 horas.')
  ).toBeVisible();
});

test('home has no newsletter, carousel, or duplicate quote CTA', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  await expect(page.getByText(/newsletter|suscríbete|suscribete/i)).toHaveCount(0);
  await expect(page.locator('[aria-label*="anterior" i], [aria-label*="siguiente" i]')).toHaveCount(
    0
  );
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
});
```

**Step 2: Run and verify failure**

```bash
pnpm test:e2e tests/e2e/home.spec.ts
```

Expected: FAIL on the new sections.

**Step 3: Build the lower sections**

`WhyZivahSection.tsx`:

- H2 “Por qué ZIVAH”.
- Four hairline rows, no cards. Each row is a 12-column grid: index/eyebrow, serif H3, description.
- Rows:
  1. “Operación propia en origen y destino.” — “Samborondón y Miami. Coordinación comercial y logística sin intermediarios.”
  2. “Documentación revisada antes del embarque.” — “Sanidad, origen y trazabilidad por lote listos para revisión del importador.”
  3. “Cadena de frío coordinada de origen a destino.” — “Control de temperatura y tiempos por etapa, con responsables definidos.”
  4. “Un solo interlocutor comercial.” — “La misma persona acompaña la cotización, la producción y el seguimiento del embarque.”

`QualityBand.tsx`:

- `data-testid='quality-band'`, navy (`bg-primary`) full-width band, paper text.
- H2 “El estándar se demuestra en cada lote.”
- Lead: “Cuatro certificaciones sostienen el acceso a los mercados donde vendemos.”
- Four `CertificationMark` items from `CERTIFICATIONS`, monochrome 1px bordered marks, uppercase label. No colored pills, no icons.
- Note: “Líneas agrícolas: GlobalGAP.”
- Text link “Ver calidad y certificaciones” → `/quality` in warm tint.

`ProcessSection.tsx`:

- H2 “De la consulta al embarque.”
- Four `data-testid='process-step'` items on a hairline timeline. No cards.
- Steps:
  1. “Consulta” — “Recibimos producto, volumen, destino y frecuencia.”
  2. “Propuesta FOB” — “Precio, empaque, calendario y documentos en 24 h.”
  3. “Aprobación y producción” — “Reservamos lote y coordinamos control de calidad.”
  4. “Embarque y seguimiento” — “Documentos, tránsito y confirmación de llegada.”
- One outline CTA “Iniciar cotización” → `/quote`.

`MarketsSection.tsx`:

- Two columns desktop: map left, market list right. On mobile, heading and list first; map is decorative and follows the list.
- H2 “Dónde llega el producto.”
- Six `data-testid='market-row'` from `MARKETS`, ordered US, JP, NL, CN, CA, AE.
- Each row: country code in a 1px square, country, hub, status (`Activo` / `Expansión`), one-line note.
- Text link “Ver mercados” → `/markets`.
- Map can be a simple inline route diagram in this task; the real map arrives in Task 8. Mark it `aria-hidden='true'` here.

`TestimonialSection.tsx`:

- One `data-testid='testimonial'`, no card, no carousel.
- Quote in Newsreader 28–36px: “La documentación llegó clara desde el inicio y eso facilitó nuestra revisión interna antes de avanzar con la compra.”
- Attribution: “Importador de mariscos · Distribuidor mayorista · Estados Unidos”.
- Hairline above and below.

`FinalCta.tsx`:

- Navy `CTABand`.
- H2 “Recibe una cotización FOB de productos del mar en 24 horas.”
- Body: “Cuéntanos producto, volumen y destino. Respondemos con precio, empaque y próximos pasos.”
- Primary “Solicitar cotización” → `/quote`.
- Secondary text links with `prose-link`: email `mailto:sales@zivahinternational.com` and WhatsApp `https://wa.me/593999002893`.
- No phone icon row.

`CTABand.tsx` props:

```ts
type CTABandProps = {
  title: string;
  body: string;
  action: { label: string; href: string };
  secondary?: ReactNode;
  tone?: 'navy' | 'paper';
};
```

`CertificationMark.tsx` props:

```ts
type CertificationMarkProps = { code: string; name: string; description?: string };
```

**Step 4: Compose the home page**

`src/app/[locale]/page.tsx`:

```tsx
<PublicShell>
  <Hero />
  <EvidenceBar />
  <SeafoodLinesSection />
  <WhyZivahSection />
  <QualityBand />
  <ProcessSection />
  <MarketsSection />
  <TestimonialSection />
  <FinalCta />
</PublicShell>
```

Delete every old section and `HeroSlider`. Remove the old `hero`, `feature`, `whyEcuador`, `categories`, `testimonials`, and `newsletter` keys from both message files once no other page uses them. Keep `seo`.

**Step 5: Run and verify**

```bash
pnpm test:e2e tests/e2e/home.spec.ts
```

Expected: 6 passing.

**Step 6: Format and commit**

```bash
pnpm exec prettier --write src/components/sections src/components/site 'src/app/[locale]/page.tsx' src/messages/es.json src/messages/en.json tests/e2e/home.spec.ts
git add src/components/sections src/components/site 'src/app/[locale]/page.tsx' src/messages/es.json src/messages/en.json tests/e2e/home.spec.ts
git rm src/components/HeroSlider.tsx src/components/sections/FeatureSection.tsx src/components/sections/WhyEcuadorSection.tsx src/components/sections/CategoriesSection.tsx src/components/sections/TestimonialsSection.tsx src/components/sections/NewsletterSection.tsx
git rm src/lib/hooks/use-scroll-animation.ts
git commit -m "feat(home): add institutional proof and closing CTA"
```

---

## Task 5: Products catalog with seafood-first ordering

**Files:**

- Create: `src/components/site/PageHeader.tsx`
- Create: `tests/e2e/products.spec.ts`
- Create: `tests/e2e/fixtures.ts`
- Modify: `src/app/[locale]/products/page.tsx`
- Modify: `src/messages/es.json`, `src/messages/en.json`

**Step 1: Create shared API fixtures**

Create `tests/e2e/fixtures.ts` with `CATEGORIES`, `PRODUCTS`, `prepare(page)`, and `mockCatalog(page)`. `prepare(page)` suppresses the cookie banner. At minimum:

```ts
import type { Page } from '@playwright/test';

export const CATEGORIES = [
  { id: 1, name: 'Productos del Mar', slug: 'marinos-y-pesca', isActive: true },
  { id: 2, name: 'Agrícolas', slug: 'agricolas', isActive: true },
  { id: 3, name: 'Otros productos', slug: 'otros-productos', isActive: true },
];

export const PRODUCTS = [
  {
    id: 10,
    name: 'Banano Cavendish Premium',
    slug: 'banano-cavendish-premium',
    shortDescription: 'Banano de exportación.',
    origin: 'Ecuador',
    certifications: ['GlobalGAP'],
    isFeatured: false,
    isActive: true,
    category: CATEGORIES[1],
  },
  {
    id: 11,
    name: 'Camarón Blanco Premium',
    slug: 'camaron-blanco-premium',
    shortDescription: 'Camarón vannamei IQF.',
    origin: 'Guayas, Ecuador',
    certifications: ['BAP', 'HACCP'],
    isFeatured: true,
    isActive: true,
    category: CATEGORIES[0],
  },
  {
    id: 12,
    name: 'Larvas de camarón Post-Larva',
    slug: 'larvas-camaron-postlarva',
    shortDescription: 'Post-larvas PL10–PL15.',
    origin: 'Guayas, Ecuador',
    certifications: ['BAP'],
    isFeatured: false,
    isActive: true,
    category: CATEGORIES[0],
  },
  {
    id: 13,
    name: 'Atún Fresco del Pacífico',
    slug: 'atun-fresco-pacifico',
    shortDescription: 'Lomos y steak de atún.',
    origin: 'Manta, Ecuador',
    certifications: ['HACCP', 'MSC'],
    isFeatured: true,
    isActive: true,
    category: CATEGORIES[0],
  },
];
```

Add the helpers:

```ts
export async function prepare(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  });
}

export async function mockCatalog(page: Page) {
  await page.route('**/api/categories*', route => route.fulfill({ json: { data: CATEGORIES } }));
  await page.route('**/api/products*', route => route.fulfill({ json: { data: PRODUCTS } }));
}
```

`mockCatalog(page)` routes:

- `**/api/categories*` → `{ data: CATEGORIES }`
- `**/api/products*` → `{ data: PRODUCTS }` (intentionally agricultural first, to prove UI sorting)

**Step 2: Write the failing catalog test**

Create `tests/e2e/products.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

import { mockCatalog, prepare } from './fixtures';

test('orders marine products before agricultural products', async ({ page }) => {
  await prepare(page);
  await mockCatalog(page);
  await page.goto('/products');

  const cards = page.getByTestId('product-card');
  await expect(cards).toHaveCount(4);
  await expect(cards.nth(0)).toContainText('Camarón Blanco Premium');
  await expect(cards.nth(1)).toContainText('Larvas de camarón Post-Larva');
  await expect(cards.nth(2)).toContainText('Atún Fresco del Pacífico');
  await expect(cards.nth(3)).toContainText('Banano Cavendish Premium');
});

test('filters seafood without breaking the full catalog default', async ({ page }) => {
  await prepare(page);
  await mockCatalog(page);
  await page.goto('/products');

  await page.getByRole('button', { name: /Productos del mar/ }).click();
  await expect(page.getByTestId('product-card')).toHaveCount(3);
  await expect(page.getByRole('button', { name: /Productos del mar/ })).toHaveAttribute(
    'aria-pressed',
    'true'
  );

  await page.getByRole('button', { name: /^Agrícolas/ }).click();
  await expect(page.getByTestId('product-card')).toHaveCount(1);
});

test('each card has one detail link and no per-card quote button', async ({ page }) => {
  await prepare(page);
  await mockCatalog(page);
  await page.goto('/products');

  const card = page.getByTestId('product-card').first();
  await expect(card.getByRole('link', { name: /Ver ficha/ })).toHaveCount(1);
  await expect(card.getByRole('link', { name: /cotizar/i })).toHaveCount(0);
  const imageSrc = await card.locator('img').getAttribute('src');
  expect(decodeURIComponent(imageSrc ?? '')).toContain('/assets/images/products/');
});

test('empty API response shows an availability path, not a zero badge', async ({ page }) => {
  await prepare(page);
  await page.route('**/api/categories*', route => route.fulfill({ json: { data: CATEGORIES } }));
  await page.route('**/api/products*', route => route.fulfill({ json: { data: [] } }));
  await page.goto('/products');

  await expect(page.getByText('Catálogo en actualización')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Consultar disponibilidad' })).toHaveAttribute(
    'href',
    '/contact'
  );
  await expect(page.getByText(/0 productos/)).toHaveCount(0);
});
```

Import `CATEGORIES` in the last test. Add `prepare` to `fixtures.ts` (same localStorage helper used elsewhere).

**Step 3: Run and verify failure**

```bash
pnpm test:e2e tests/e2e/products.spec.ts
```

Expected: FAIL; current order follows API and cards use a filled pill filter.

**Step 4: Rebuild the catalog UI**

`PageHeader.tsx` props:

```ts
type Crumb = { label: string; href?: string };
type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  action?: ReactNode;
};
```

- Container max 1200px, top padding 112px, bottom 56px.
- Breadcrumb text 12px muted, slash separators.
- Eyebrow 11px uppercase accent.
- H1 serif `clamp(2.5rem, 5vw, 4.5rem)`, max 16ch.
- Lead max 62ch, muted.
- Action right aligned on desktop, below on mobile.
- One CTA only.

Products page:

- `PublicShell`, `PageHeader` with breadcrumb Inicio / Productos, eyebrow “Catálogo de exportación”, H1 “Productos del mar y líneas agrícolas”, lead “Camarón, larvas y atún primero. Frutas tropicales, café y cacao como líneas complementarias.”, action “Solicitar cotización” → `/quote`.
- Keep client filtering. Read `?category=` on mount.
- Sort every view:
  1. `camaron-blanco-premium`, `larvas-camaron-postlarva`, `atun-fresco-pacifico`
  2. other `marinos-y-pesca`
  3. `agricolas`
  4. `otros-productos`
- Default `Todos`. Filter row: text buttons with counts, active underline, `aria-pressed`; no filled pills.
- Grid 3/2/1 columns, `gap-6`.
- `ProductCard` with `data-testid='product-card'`: 4:3 image, 1px border, surface, 2px radius, category 11px uppercase muted, serif H3, short description 2 lines, origin line, certifications as monochrome text separated by `·`, link “Ver ficha”. No price, no add-to-quote button. It must be presentational and safe in both server sections and the client catalog page: pass labels/hrefs as props, do not import `getTranslations` or server-only modules.
- Loading: 3 skeleton cards with 4:3 image blocks.
- Empty API: H2 “Catálogo en actualización”, body “El catálogo se actualiza periódicamente. Escríbenos y confirmamos disponibilidad para tu mercado.”, link “Consultar disponibilidad” → `/contact`. No icon, no “0”.
- Filter with no matches: “No hay productos en esta categoría.” and a text button “Ver todos”.
- Images use `getProductImage` for now; Task 12 makes them local.

**Step 5: Add messages**

Add `products.eyebrow`, `products.title`, `products.lead`, `products.requestQuote`, `products.all`, `products.seafood`, `products.agricultural`, `products.other`, `products.viewDetail`, `products.emptyTitle`, `products.emptyBody`, `products.emptyCta`, `products.filterEmpty`, `products.clearFilter`.

Spanish H1: “Productos del mar y líneas agrícolas”.
English H1: “Seafood and agricultural lines”.

**Step 6: Run and verify**

```bash
pnpm test:e2e tests/e2e/products.spec.ts
```

Expected: 4 passing.

**Step 7: Format and commit**

```bash
pnpm exec prettier --write src/components/site/PageHeader.tsx 'src/app/[locale]/products/page.tsx' tests/e2e/fixtures.ts tests/e2e/products.spec.ts src/messages/es.json src/messages/en.json
git add src/components/site/PageHeader.tsx 'src/app/[locale]/products/page.tsx' tests/e2e/fixtures.ts tests/e2e/products.spec.ts src/messages/es.json src/messages/en.json
git commit -m "feat(products): rebuild catalog with seafood-first ordering"
```

---

## Task 6: Product detail and technical sheet

**Files:**

- Create: `tests/fixtures/api-stub.mjs`
- Create: `tests/e2e/product-detail.spec.ts`
- Modify: `playwright.config.ts` (add stub `webServer`)
- Modify: `src/app/[locale]/products/[slug]/page.tsx`
- Modify: `src/app/[locale]/products/[slug]/ficha-tecnica/page.tsx`
- Modify: `src/app/[locale]/products/[slug]/ficha-tecnica/PrintButton.tsx`
- Modify: `src/components/site/ProductCard.tsx` (reuse on related products)
- Modify: `src/messages/es.json`, `src/messages/en.json`

**Step 1: Add the stub API server**

Create `tests/fixtures/api-stub.mjs`:

```js
import http from 'node:http';

const categories = [
  { id: 1, name: 'Productos del Mar', slug: 'marinos-y-pesca', isActive: true },
  { id: 2, name: 'Agrícolas', slug: 'agricolas', isActive: true },
];

const products = [
  {
    id: 11,
    name: 'Camarón Blanco Premium',
    slug: 'camaron-blanco-premium',
    shortDescription: 'Camarón vannamei IQF.',
    description: 'Camarón blanco ecuatoriano para exportación.',
    origin: 'Guayas, Ecuador',
    stockQuantity: 1000,
    specifications: { Calibre: '16/20' },
    certifications: ['BAP', 'HACCP'],
    isFeatured: true,
    isActive: true,
    category: categories[0],
  },
  {
    id: 12,
    name: 'Larvas de camarón Post-Larva',
    slug: 'larvas-camaron-postlarva',
    shortDescription: 'Post-larvas PL10–PL15.',
    origin: 'Guayas, Ecuador',
    stockQuantity: 1000,
    certifications: ['BAP'],
    isFeatured: false,
    isActive: true,
    category: categories[0],
  },
  {
    id: 13,
    name: 'Atún Fresco del Pacífico',
    slug: 'atun-fresco-pacifico',
    shortDescription: 'Lomos y steak de atún.',
    origin: 'Manta, Ecuador',
    stockQuantity: 1000,
    certifications: ['HACCP', 'MSC'],
    isFeatured: true,
    isActive: true,
    category: categories[0],
  },
];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:4010');
  res.setHeader('content-type', 'application/json');

  if (url.pathname === '/api/products') {
    const search = url.searchParams.get('search');
    const data = search ? products.filter(product => product.slug === search) : products;
    return res.end(JSON.stringify({ error: false, data }));
  }

  if (url.pathname === '/api/categories') {
    return res.end(JSON.stringify({ error: false, data: categories }));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: true, message: 'Not found' }));
});

server.listen(4010, '127.0.0.1');
```

Add the stub to `playwright.config.ts` as the **first** `webServer` entry:

```ts
{
  command: 'node tests/fixtures/api-stub.mjs',
  url: 'http://127.0.0.1:4010/api/products',
  reuseExistingServer: false,
  timeout: 30_000,
},
```

**Step 2: Write the failing detail tests**

Create `tests/e2e/product-detail.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

import { prepare } from './fixtures';

test('product detail leads with a local image, specs, and one product quote CTA', async ({
  page,
}) => {
  await prepare(page);
  await page.goto('/products/camaron-blanco-premium');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Camarón Blanco Premium');
  await expect(page.getByTestId('product-hero-image')).toHaveAttribute(
    'src',
    /camaron-blanco-premium\.jpg/
  );
  await expect(page.getByTestId('product-specs')).toContainText('Guayas, Ecuador');
  await expect(
    page.getByRole('link', { name: 'Solicitar cotización para este producto' })
  ).toHaveAttribute('href', '/quote?product=camaron-blanco-premium');
  await expect(page.getByRole('link', { name: 'Descargar ficha técnica' })).toHaveAttribute(
    'href',
    '/products/camaron-blanco-premium/ficha-tecnica'
  );
});

test('related products are capped at three and exclude the current product', async ({ page }) => {
  await prepare(page);
  await page.goto('/products/camaron-blanco-premium');

  const related = page.getByTestId('related-product');
  await expect(related).toHaveCount(2);
  await expect(related.first()).not.toContainText('Camarón Blanco Premium');
});

test('technical sheet is print-friendly and has a screen-only print button', async ({ page }) => {
  await prepare(page);
  await page.goto('/products/camaron-blanco-premium/ficha-tecnica');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ficha Técnica');
  await expect(page.getByRole('button', { name: /imprimir/i })).toBeVisible();
  await expect(page.locator('.no-print').first()).toBeVisible();
  await expect(page.getByText('🇪🇨')).toHaveCount(0);
});
```

**Step 3: Run and verify failure**

```bash
pnpm test:e2e tests/e2e/product-detail.spec.ts
```

Expected: the page may 404 or show broken stored image paths, the CTA points to `/#quote`, and the sheet contains emoji.

**Step 4: Rebuild product detail**

- Use `PublicShell`. Remove the mobile sticky CTA bar; the in-page CTA is the single action.
- Fetch product and related products in parallel. Related: up to 3, same category first, exclude current.
- Two columns desktop 7/5 (image left, content right); stack with heading first on mobile.
- Image: `next/image`, `data-testid='product-hero-image'`, local `getProductImage(slug, categorySlug)`, 4:3, priority, sizes 50vw.
- Right: category eyebrow, H1, one-line `shortDescription`, vertical spec table `data-testid='product-specs'`:
  - Origen — `product.origin`
  - Calibre — `ficha.especificaciones['Calibre']` / `['Calibre (mm)']` / first spec
  - Empaque — first value of `ficha.empaque`
  - Certificaciones — `product.certifications` joined with `·`
  - Temporada — `ficha.temporadaDisponible`
- Primary CTA: “Solicitar cotización para este producto” → `/quote?product=<slug>`.
- Secondary: “Descargar ficha técnica” → `/products/<slug>/ficha-tecnica`.
- Below: description, certification marks row, related products grid (`data-testid='related-product'`, max 3).
- No colored badges. No emoji. No sticky duplicate CTA.
- `generateMetadata` must use the local image path.

**Step 5: Rebuild the technical sheet**

- Wrap the screen view in `PublicShell` so it has the same navigation; the site header/footer are hidden in print via `.site-header`/`.site-footer`.
- Max width 800px, white document in both themes (screen and print). Replace the old `bg-gray-*`/`text-gray-*` one-offs with black/neutral document text and hairline rules.
- Header: logo, “Ficha Técnica de Exportación”, product name, date, SKU, origin (text “Ecuador”, no flag).
- Body sections: identity, specifications, packaging, storage, nutrition when available, certifications, contact block.
- Print button screen only. Back link screen only.
- Restyle `PrintButton.tsx`: remove the 🖨️ emoji, use a monochrome printer icon or plain text “Imprimir / Descargar PDF”, 2px radius, `brand` styling, and keep `aria-label='Imprimir ficha técnica'`.
- Replace `product.category.icon` emoji with plain category text.
- Hide navigation/footer/buttons in print via the global print CSS.
- Fix `getProductImage` call to the new two-argument form after Task 12; for now keep three arguments if the helper still accepts them.

**Step 6: Add messages**

Add `productDetail.*`: `requestQuote`, `downloadSheet`, `specsTitle`, `origin`, `size`, `packaging`, `certifications`, `season`, `relatedTitle`, `backToCatalog`, `notFound`.
English mirror.

**Step 7: Run and verify**

```bash
pnpm test:e2e tests/e2e/product-detail.spec.ts
```

Expected: 3 passing. Related count is 2 because the fixture has 3 marine products total.

**Step 8: Format and commit**

```bash
pnpm exec prettier --write playwright.config.ts tests/fixtures/api-stub.mjs tests/e2e/product-detail.spec.ts 'src/app/[locale]/products/[slug]/page.tsx' 'src/app/[locale]/products/[slug]/ficha-tecnica/page.tsx' 'src/app/[locale]/products/[slug]/ficha-tecnica/PrintButton.tsx' src/components/site/ProductCard.tsx src/messages/es.json src/messages/en.json
git add playwright.config.ts tests/fixtures/api-stub.mjs tests/e2e/product-detail.spec.ts 'src/app/[locale]/products/[slug]/page.tsx' 'src/app/[locale]/products/[slug]/ficha-tecnica/page.tsx' 'src/app/[locale]/products/[slug]/ficha-tecnica/PrintButton.tsx' src/components/site/ProductCard.tsx src/messages/es.json src/messages/en.json
git commit -m "feat(products): redesign product detail and technical sheet"
```

---

## Task 7: Quality page

**Files:**

- Modify: `src/app/[locale]/quality/page.tsx`
- Create: `src/components/site/ProcessStep.tsx` if not already created in Task 4
- Modify: `src/messages/es.json`, `src/messages/en.json`
- Create: `tests/e2e/quality.spec.ts`

**Step 1: Write the failing test**

```ts
import { expect, test } from '@playwright/test';

import { prepare } from './fixtures';

test('quality page leads with four marine certifications and one CTA', async ({ page }) => {
  await prepare(page);
  await page.goto('/quality');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Certificaciones que abren mercados.'
  );
  for (const code of ['BAP', 'HACCP', 'BRC', 'MSC']) {
    await expect(page.getByTestId('certification-row').filter({ hasText: code })).toHaveCount(1);
  }
  await expect(page.getByText('Líneas agrícolas: GlobalGAP.')).toBeVisible();
  await expect(page.getByTestId('quality-step')).toHaveCount(4);
  await expect(
    page.locator('main').getByRole('link', { name: 'Solicitar cotización' })
  ).toHaveCount(1);
});

test('quality page has no emoji or tinted certification cards', async ({ page }) => {
  await prepare(page);
  await page.goto('/quality');

  await expect(page.getByText(/🦐|🔬|🏷️|🌱|🏆|⭐/u)).toHaveCount(0);

  const backgrounds = await page
    .getByTestId('certification-row')
    .evaluateAll(nodes => nodes.map(node => getComputedStyle(node).backgroundColor));
  expect(new Set(backgrounds).size).toBe(1);
});
```

**Step 2: Run and verify failure**

```bash
pnpm test:e2e tests/e2e/quality.spec.ts
```

Expected: FAIL on H1, cert rows, timeline, emoji.

**Step 3: Rebuild the page**

- `PublicShell`, `PageHeader`:
  - Breadcrumb Inicio / Calidad.
  - Eyebrow “Calidad y trazabilidad”.
  - H1 “Certificaciones que abren mercados.”
  - Lead “BAP, HACCP, BRC y MSC sostienen el acceso a los mercados donde vendemos. GlobalGAP aplica a nuestras líneas agrícolas.”
- Four certification rows (`data-testid='certification-row'`) from `CERTIFICATIONS`: monochrome 1px bordered code block, name, description, scope. No cards, no tint, no emoji.
- Small note “Líneas agrícolas: GlobalGAP.” in muted text.
- Quality control timeline with 4 `data-testid='quality-step'` items:
  1. “Recepción y verificación” — “Revisión documental y física por lote.”
  2. “Cadena de frío” — “Temperatura y tiempos registrados por etapa.”
  3. “Análisis microbiológico” — “Controles por lote según destino.”
  4. “Documentación de embarque” — “Sanidad, origen y trazabilidad listos para revisión.”
- Evidence bar with the same metrics as Home.
- One navy CTA band: “Solicita la documentación de tu próximo lote.” → `/quote`.

**Step 4: Run and verify**

```bash
pnpm test:e2e tests/e2e/quality.spec.ts
```

Expected: 2 passing.

**Step 5: Format and commit**

```bash
pnpm exec prettier --write 'src/app/[locale]/quality/page.tsx' tests/e2e/quality.spec.ts src/messages/es.json src/messages/en.json
git add 'src/app/[locale]/quality/page.tsx' tests/e2e/quality.spec.ts src/messages/es.json src/messages/en.json
git commit -m "feat(quality): align quality page with editorial system"
```

---

## Task 8: Markets page with a local map

**Files:**

- Create: `public/assets/images/world-map.svg`
- Create: `src/components/site/MarketMap.tsx`
- Modify: `src/components/sections/MarketsSection.tsx`
- Modify: `src/app/[locale]/markets/page.tsx`
- Modify: `src/messages/es.json`, `src/messages/en.json`
- Create: `tests/e2e/markets.spec.ts`

**Step 1: Add the local map**

```bash
curl -L 'https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg' -o public/assets/images/world-map.svg
```

Expected: about 84 KB, SVG. Keep the source/license note in `docs/superpowers/specs` or a code comment: Wikimedia Commons, public-domain world map.

**Step 2: Write the failing test**

```ts
import { expect, test } from '@playwright/test';

import { prepare } from './fixtures';

test('markets page shows six markets, four active, and a text-alternative map', async ({
  page,
}) => {
  await prepare(page);
  await page.goto('/markets');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Desde Guayas y Miami al mundo.'
  );
  await expect(page.getByTestId('market-row')).toHaveCount(6);
  await expect(page.getByTestId('market-row').filter({ hasText: 'Activo' })).toHaveCount(4);
  await expect(page.getByRole('img', { name: /mapa de mercados/i })).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('markets page uses country codes, not flag emoji', async ({ page }) => {
  await prepare(page);
  await page.goto('/markets');

  await expect(page.getByText('US', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/🇺🇸|🇯🇵|🇳🇱|🇨🇳|🇨🇦|🇦🇪/u)).toHaveCount(0);
});
```

**Step 3: Run and verify failure**

```bash
pnpm test:e2e tests/e2e/markets.spec.ts
```

Expected: FAIL on H1, rows, map, flags.

**Step 4: Rebuild the page**

- `PublicShell`, `PageHeader`:
  - Breadcrumb Inicio / Mercados.
  - Eyebrow “Presencia comercial”.
  - H1 “Desde Guayas y Miami al mundo.”
  - Lead “Seis mercados. Cuatro activos. Una operación comercial y logística coordinada desde origen.”
- `MarketMap`:
  - Replace the temporary home `MarketsSection` diagram with this component too.
  - `<div role='img' aria-label='Mapa de mercados de ZIVAH'>`.
  - Local `<Image src='/assets/images/world-map.svg' alt='' fill className='object-contain opacity-20 grayscale dark:invert' />`.
  - Accent dots positioned with `left/top` percentages from `MARKETS`; active dots solid accent, expansion dots outlined.
  - Country code labels visible near dots on desktop; hidden on mobile.
- Market rows (`data-testid='market-row'`): country code square, country, hub, status, one-line note. Hairline separators. No flag emoji, no cards.
- Order: US, JP, NL, CN, CA, AE.
- Four evidence rows, not cards: “Origen y destino propios”, “Tránsitos documentados”, “Equipo en tu zona horaria”, “Trazabilidad por lote”.
- One CTA band: “Consulta disponibilidad para tu mercado.” → `/quote`.

**Step 5: Run and verify**

```bash
pnpm test:e2e tests/e2e/markets.spec.ts
```

Expected: 2 passing.

**Step 6: Format and commit**

```bash
pnpm exec prettier --write src/components/site/MarketMap.tsx src/components/sections/MarketsSection.tsx 'src/app/[locale]/markets/page.tsx' tests/e2e/markets.spec.ts src/messages/es.json src/messages/en.json
git add src/components/site/MarketMap.tsx src/components/sections/MarketsSection.tsx 'src/app/[locale]/markets/page.tsx' tests/e2e/markets.spec.ts src/messages/es.json src/messages/en.json public/assets/images/world-map.svg
git commit -m "feat(markets): align markets page with editorial system"
```

---

## Task 9: Quote page and form restyle

**Files:**

- Modify: `src/app/[locale]/quote/page.tsx`
- Modify: `src/components/QuoteForm.tsx`
- Modify: `src/lib/validations/index.ts`
- Create: `src/components/site/ContactLine.tsx` if useful
- Modify: `src/messages/es.json`, `src/messages/en.json`
- Create: `tests/e2e/quote.spec.ts`

**Step 1: Write the failing quote test**

Add `mockQuoteApis(page)` to `tests/e2e/fixtures.ts`:

```ts
export async function mockQuoteApis(page: Page) {
  await page.route('**/api/quotes/countries', route =>
    route.fulfill({
      json: {
        error: false,
        data: [{ id: 1, name: 'Estados Unidos', code: 'US' }],
      },
    })
  );
  await page.route('**/api/quotes/measures', route =>
    route.fulfill({
      json: {
        error: false,
        data: [{ id: 1, name: 'Kilogramo', shortName: 'kg', type: 'weight', family: 'weight' }],
      },
    })
  );
  await page.route('**/api/quotes/products/search*', route =>
    route.fulfill({ json: { error: false, data: [] } })
  );
}
```

Test:

```ts
import { expect, test } from '@playwright/test';

import { mockQuoteApis, prepare } from './fixtures';

test('quote page has one primary action and a two-column layout', async ({ page }) => {
  await prepare(page);
  await mockQuoteApis(page);
  await page.goto('/quote');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Recibe una propuesta comercial en 24 horas.'
  );
  await expect(page.getByRole('button', { name: 'Enviar solicitud' })).toHaveCount(1);
  await expect(page.locator('main').getByRole('link', { name: /WhatsApp/i })).toHaveCount(1);
  await expect(page.locator('header a[href="/quote"]')).toHaveCount(0);
});

test('empty submit shows inline validation without a network request', async ({ page }) => {
  await prepare(page);
  await mockQuoteApis(page);
  let quoteRequests = 0;
  await page.route('**/api/quotes', route => {
    quoteRequests += 1;
    return route.fulfill({ json: { error: false } });
  });
  await page.goto('/quote');

  await page.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect(page.getByText('El nombre debe tener al menos 2 caracteres')).toBeVisible();
  expect(quoteRequests).toBe(0);
});

test('English quote form shows English validation messages', async ({ page }) => {
  await prepare(page);
  await mockQuoteApis(page);
  await page.goto('/en/quote');

  await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
});
```

**Step 2: Run and verify failure**

```bash
pnpm test:e2e tests/e2e/quote.spec.ts
```

Expected: FAIL on H1, button label, column layout, nav CTA, and validation.

**Step 3: Rebuild the quote page shell**

- `PublicShell`, top padding 112px.
- H1 “Recibe una propuesta comercial en 24 horas.”
- Lead “Cotización FOB para camarón, larvas, atún o líneas agrícolas. Incluye precio, empaque, calendario y documentos.”
- Two columns desktop `lg:grid-cols-[0.8fr_1.4fr]`, gap 64px. Mobile stacks intro first.
- Left column, sticky desktop:
  - “Qué incluye tu propuesta”: Precio FOB y unidad de medida; Empaque y volumen mínimo; Calendario de disponibilidad; Documentos de exportación.
  - Direct contact: email, WhatsApp text link, phone.
  - Trust markers as text: “Respuesta en 24 h”, “Información confidencial”, “Trazabilidad por lote”.
  - No second solid CTA.
- Right: form on `bg-surface`, 1px border, 2px radius, `p-6 sm:p-8`. No card shadow.
- Privacy note directly below the submit button.

**Step 4: Restyle `QuoteForm` without changing behavior**

At the top of `QuoteForm.tsx`, define class constants:

```ts
const labelClass =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground';
const inputClass =
  'h-11 w-full rounded-[2px] border border-input bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none';
const errorClass = 'mt-1 text-[13px] text-destructive';
```

- Apply to name, email, country, phone, company, product search, quantity, measure, unit price, notes, and message.
- Remove emoji from labels and chips, including `✓ Agregado`; use text “Agregado”.
- Remove dark-mode one-off colors; use tokens only.
- Keep `react-hook-form`, `zodResolver(createQuoteSchema)`, API calls, price conversion, and success/error states unchanged.
- Buttons: submit `variant='brand'`, full width, label “Enviar solicitud”; loading label “Enviando…”, disabled while submitting.
- Selected product rows: hairline separators, no filled colored chips.
- Error summary for server failure: top of form, `role='alert'`, with a link to the first invalid field where practical.
- Ensure every input has an explicit `<label>`; keep labels visible, no placeholder-only fields.
- Form section headings use serif H2/H3.

**Step 5: Localize the quote validation messages**

The API schema must not change. Only the client-facing `createQuoteSchema` factory is refactored.

In `src/lib/validations/index.ts`:

```ts
export type QuoteSchemaMessages = {
  nameMin: string;
  nameMax: string;
  emailInvalid: string;
  phoneInvalid: string;
  phoneMin: string;
  phoneMax: string;
  countryInvalid: string;
  recipientEmailInvalid: string;
  itemsMin: string;
  phoneCountryInvalid: string;
};

const DEFAULT_QUOTE_MESSAGES: QuoteSchemaMessages = {
  nameMin: 'El nombre debe tener al menos 2 caracteres',
  nameMax: 'El nombre no puede exceder 255 caracteres',
  emailInvalid: 'Debe ser un email válido',
  phoneInvalid: 'Debe ser un número de teléfono válido',
  phoneMin: 'El teléfono debe tener al menos 10 dígitos',
  phoneMax: 'El teléfono no puede exceder 20 caracteres',
  countryInvalid: 'Debe seleccionar un país válido',
  recipientEmailInvalid: 'Debe ser un email válido para envío',
  itemsMin: 'Debe incluir al menos un producto',
  phoneCountryInvalid: 'Formato de teléfono inválido para el país seleccionado',
};

export function createQuoteSchema(messages: QuoteSchemaMessages = DEFAULT_QUOTE_MESSAGES) {
  return z
    .object({
      // same fields and refinements, but every message uses `messages.*`
    })
    .refine(/* same phone refinement */, {
      message: messages.phoneCountryInvalid,
      path: ['customerPhone'],
    });
}

export type CreateQuoteInput = z.infer<ReturnType<typeof createQuoteSchema>>;
```

In `QuoteForm.tsx`, add `useMemo` to the React import, then:

```ts
const schema = useMemo(
  () =>
    createQuoteSchema({
      nameMin: t('validation.nameMin'),
      nameMax: t('validation.nameMax'),
      emailInvalid: t('validation.emailInvalid'),
      phoneInvalid: t('validation.phoneInvalid'),
      phoneMin: t('validation.phoneMin'),
      phoneMax: t('validation.phoneMax'),
      countryInvalid: t('validation.countryInvalid'),
      recipientEmailInvalid: t('validation.recipientEmailInvalid'),
      itemsMin: t('validation.itemsMin'),
      phoneCountryInvalid: t('validation.phoneCountryInvalid'),
    }),
  [t]
);
```

Use `useForm({ resolver: zodResolver(schema), ... })`. Keep the same default values and submit handler. The existing Spanish messages are the defaults for any non-localized caller.

Add the ten `quoteForm.validation.*` keys to both locales. English values:

- `Name must be at least 2 characters`
- `Name cannot exceed 255 characters`
- `Enter a valid email address`
- `Enter a valid phone number`
- `Phone must have at least 10 digits`
- `Phone cannot exceed 20 characters`
- `Select a valid country`
- `Enter a valid recipient email`
- `Add at least one product`
- `Invalid phone format for the selected country`

**Step 6: Add messages**

Add `quote.*` for H1, lead, includes list, direct contact, form title, submit, privacy, success, error. Change `quoteForm.submitButton` to “Enviar solicitud” and `submitting` to “Enviando…”. Replace “Haga clic” with “Selecciona”. English mirror:

- H1: “Receive a commercial proposal within 24 hours.”
- Lead: “FOB quote for shrimp, post-larvae, tuna, or agricultural lines. Includes price, packaging, schedule, and documents.”
- Submit: “Send request”.
- Loading: “Sending…”.

**Step 7: Run and verify**

```bash
pnpm test:e2e tests/e2e/quote.spec.ts
```

Expected: 3 passing.

**Step 8: Format and commit**

```bash
pnpm exec prettier --write 'src/app/[locale]/quote/page.tsx' src/components/QuoteForm.tsx src/lib/validations/index.ts tests/e2e/quote.spec.ts src/messages/es.json src/messages/en.json
git add 'src/app/[locale]/quote/page.tsx' src/components/QuoteForm.tsx src/lib/validations/index.ts tests/e2e/quote.spec.ts src/messages/es.json src/messages/en.json
git commit -m "feat(quote): restyle quote flow with single conversion path"
```

---

## Task 10: Contact page

**Files:**

- Modify: `src/app/[locale]/contact/page.tsx`
- Modify: `src/messages/es.json`, `src/messages/en.json`
- Create: `tests/e2e/contact.spec.ts`

**Step 1: Write the failing contact test**

```ts
import { expect, test } from '@playwright/test';

import { prepare } from './fixtures';

test('contact page shows both offices, direct links, and one form', async ({ page }) => {
  await prepare(page);
  await page.goto('/contact');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Hablemos de tu próxima compra.'
  );
  const main = page.locator('main');
  await expect(main.getByText('Samborondón, Guayas')).toBeVisible();
  await expect(main.getByText('Miami, Florida')).toBeVisible();
  await expect(main.getByRole('link', { name: /sales@zivahinternational\.com/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /\+593 99 900 2893/ })).toBeVisible();
  await expect(main.getByRole('link', { name: /WhatsApp/i })).toHaveCount(1);
  await expect(main.getByRole('button', { name: /enviar mensaje/i })).toHaveCount(1);
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('contact page has no emoji icons or voseo', async ({ page }) => {
  await prepare(page);
  await page.goto('/contact');

  await expect(page.getByText(/📍|🇪🇨|🇺🇸|🕒|📞|✉️/u)).toHaveCount(0);
  await expect(page.getByText(/Contanos|buscás|Recibí|tenés|podés|querés/i)).toHaveCount(0);
});
```

**Step 2: Run and verify failure**

```bash
pnpm test:e2e tests/e2e/contact.spec.ts
```

Expected: FAIL on H1, emoji, form label.

**Step 3: Rebuild the page**

- `PublicShell`, `PageHeader`:
  - Breadcrumb Inicio / Contacto.
  - Eyebrow “Contacto comercial”.
  - H1 “Hablemos de tu próxima compra.”
  - Lead “Escríbenos con producto, volumen y destino. Respondemos en 24 horas hábiles.”
- Two columns desktop. Left:
  - Ecuador office: Samborondón, Guayas; “Operación logística principal”.
  - Miami office: Miami, Florida; “Operación comercial”.
  - Email, phone, hours as text links.
  - WhatsApp text link with a small monochrome icon, not floating.
  - “Ver indicaciones” external link; explain “No usamos mapas embebidos.”
- Right: short form with name, company, email, phone, message, submit “Enviar mensaje”. `action='mailto:sales@zivahinternational.com'` is acceptable; preserve behavior. Use the same input classes as Quote.
- Remove flags and emoji. Country code labels only if needed.
- No duplicate quote CTA above the form; a secondary text link “¿Necesitas una cotización FOB? Solicítala aquí” is allowed below the form.

**Step 4: Add messages**

Add `contact.*` for H1, lead, office labels, hours, directions, form labels, submit, WhatsApp, privacy note. English mirror. Replace voseo forms.

**Step 5: Run and verify**

```bash
pnpm test:e2e tests/e2e/contact.spec.ts
```

Expected: 2 passing.

**Step 6: Format and commit**

```bash
pnpm exec prettier --write 'src/app/[locale]/contact/page.tsx' tests/e2e/contact.spec.ts src/messages/es.json src/messages/en.json
git add 'src/app/[locale]/contact/page.tsx' tests/e2e/contact.spec.ts src/messages/es.json src/messages/en.json
git commit -m "feat(contact): rebuild contact page and form"
```

---

## Task 11: Legal, auth, metadata, and i18n parity

**Files:**

- Create: `src/app/[locale]/legal/layout.tsx`
- Modify: `src/app/[locale]/legal/privacy-policy/page.tsx`
- Modify: `src/app/[locale]/legal/terms-of-service/page.tsx`
- Modify: `src/app/[locale]/legal/cookie-policy/page.tsx`
- Modify: `src/app/[locale]/legal/data-protection/page.tsx`
- Modify: `src/app/(auth)/layout.tsx`
- Modify: `src/app/(auth)/sign-in/page.tsx`
- Modify: `src/app/(auth)/sign-up/page.tsx`
- Modify: `src/components/StructuredData.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/[locale]/layout.tsx` metadata
- Modify: `src/messages/es.json`, `src/messages/en.json`
- Create: `tests/e2e/i18n.spec.ts`
- Create: `tests/e2e/legal-auth.spec.ts`

**Step 1: Write failing parity and legal/auth tests**

`tests/e2e/i18n.spec.ts`:

```ts
import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import es from '../../src/messages/es.json';
import en from '../../src/messages/en.json';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function flatten(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key)
  );
}

test('Spanish and English message keys match', () => {
  expect(flatten(en).sort()).toEqual(flatten(es).sort());
});

test('Spanish copy has no voseo forms', () => {
  const text = JSON.stringify(es);
  expect(text).not.toMatch(/Contanos|buscás|Recibí|tenés|podés|querés|mirá|fijate/i);
});

test('public source has no emoji icons', () => {
  const files = [
    ...walk('src/app/[locale]'),
    ...walk('src/components/site'),
    ...walk('src/components/sections'),
    'src/components/Navigation.tsx',
    'src/components/Footer.tsx',
    'src/components/ThemeToggle.tsx',
    'src/components/LanguageSwitcher.tsx',
    'src/components/CookieConsent.tsx',
    'src/components/QuoteForm.tsx',
  ].filter(file => /\.(tsx?|jsx?)$/.test(file));
  const emoji = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    expect(content, file).not.toMatch(emoji);
  }

  expect(`${JSON.stringify(es)}${JSON.stringify(en)}`).not.toMatch(emoji);
});

test('English route mirrors the seafood-first home', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'accepted'));
  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Ecuadorian seafood, ready for export.'
  );
});

test('language switcher updates the document language', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'accepted'));
  await page.goto('/');

  await page.getByLabel(/idioma/i).selectOption('en');
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
```

`tests/e2e/legal-auth.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

import { prepare } from './fixtures';

test('legal pages use a 720px measure and one serif H1', async ({ page }) => {
  await prepare(page);
  await page.goto('/legal/privacy-policy');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Política de Privacidad');
  await expect(page.getByText(/Última actualización/)).toBeVisible();
  await expect(page.locator('header')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('sign-in uses the public tokens and keeps one primary action', async ({ page }) => {
  await prepare(page);
  await page.goto('/sign-in');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('ZIVAH');
  await expect(page.getByRole('button', { name: /iniciar sesión|sign in/i })).toHaveCount(1);
  await expect(page.getByText('🌿')).toHaveCount(0);
});
```

**Step 2: Run and verify failure**

```bash
pnpm test:e2e tests/e2e/i18n.spec.ts tests/e2e/legal-auth.spec.ts
```

Expected: FAIL on missing keys, English H1, legal measure, auth emoji.

**Step 3: Add the legal layout**

Create `src/app/[locale]/legal/layout.tsx`:

```tsx
import { getLocale } from 'next-intl/server';

import PublicShell from '@/components/site/PublicShell';

export default async function LegalLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <PublicShell>
      <div className='container mx-auto max-w-[720px] px-4 py-28 sm:px-6'>
        {locale === 'en' && (
          <p className='mb-8 border-l-2 border-accent pl-4 text-sm text-muted-foreground'>
            This legal document is currently available in Spanish. For an English version, contact
            sales@zivahinternational.com.
          </p>
        )}
        {children}
      </div>
    </PublicShell>
  );
}
```

Do not translate the authoritative legal body copy in this redesign. Keep it in Spanish and show the notice on `/en`. This avoids creating unofficial legal translations.

**Step 4: Restyle the four legal pages**

- Remove each page's own `min-h-screen`, centered header, and `bg-card` wrapper.
- H1 serif `clamp(2.25rem, 4vw, 3.5rem)`, left aligned.
- Add “Última actualización: 21 de octubre de 2026” under the H1.
- Add a simple anchor index of sections at the top (two columns on desktop, one on mobile).
- Body in Inter, 16px/1.7, max 720px, with H2 serif and hairline separators.
- Preserve all existing legal text and section IDs. Do not remove clauses.
- Replace `next/link` with `Link` from `@/i18n/routing` if any legal page links to another public page.
- Remove gradient/tinted backgrounds.

**Step 5: Restyle auth**

- `src/app/(auth)/layout.tsx`: add `public-site` wrapper class, `bg-background`, no green gradient. Center a 420px surface with `bg-surface`, 1px border, 2px radius.
- Replace `🌿 ZIVAH International` with the local logo image and a text label “Acceso administrativo” / “Admin access”.
- Remove green classes from sign-in/sign-up inputs/buttons; use the same `inputClass` and `brand` button.
- Keep all auth logic, API calls, redirects, and error behavior unchanged.
- One primary action per page.

**Step 6: Update metadata and JSON-LD**

In `src/app/[locale]/layout.tsx` and both message files:

- ES title: `ZIVAH International — Camarón, larvas y atún de Ecuador`
- ES description: `Exportamos camarón blanco, larvas de camarón y atún del Pacífico desde Ecuador. Documentación, trazabilidad y cotización FOB en 24 horas.`
- EN title: `ZIVAH International — Shrimp, post-larvae and tuna from Ecuador`
- EN description: `We export white shrimp, shrimp post-larvae and Pacific tuna from Ecuador. Documentation, traceability and an FOB quote within 24 hours.`
- Keywords: seafood/aquaculture first, agricultural secondary.
- Update `seo.industry` to “Exportación de productos del mar y acuicultura” / “Seafood and aquaculture export”.
- In `StructuredData.tsx`, update the organization description and order `knowsAbout` with shrimp, aquaculture larvae, tuna, then tropical fruits/coffee/cocoa. Keep URLs, address, and contact data.
- In `src/app/sitemap.ts`, replace the fictional product slugs (`tropical-fruits`, `shrimp`, `vannamei-shrimp`, etc.) with the real curated slugs used by `product-images.ts`, and replace the fictional category slugs with `marinos-y-pesca`, `agricolas`, and `otros-productos`. Do not add a database query.
- Add an assertion to `i18n.spec.ts` that `GET /sitemap.xml` contains `/products/camaron-blanco-premium` and does not contain `/products/vannamei-shrimp`.

**Step 7: Rebuild/remove stale message keys**

- Remove keys for deleted sections: `hero`, `feature`, `whyEcuador`, `categories`, `testimonials`, `newsletter`.
- Keep `nav`, `footer`, `cookies`, `home`, `metrics`, `products`, `productDetail`, `quality`, `markets`, `quote`, `quoteForm`, `contact`, `seo`, `metadata`, `auth`, `errors`.
- Ensure key parity recursively.
- Run a voseo grep over both files.

**Step 8: Run and verify**

```bash
pnpm test:e2e tests/e2e/i18n.spec.ts tests/e2e/legal-auth.spec.ts
pnpm test:e2e tests/e2e/home.spec.ts
```

Expected: all pass.

**Step 9: Format and commit**

```bash
pnpm exec prettier --write 'src/app/[locale]/legal' 'src/app/(auth)' src/components/StructuredData.tsx 'src/app/[locale]/layout.tsx' src/messages/es.json src/messages/en.json tests/e2e/i18n.spec.ts tests/e2e/legal-auth.spec.ts
git add 'src/app/[locale]/legal' 'src/app/(auth)' src/components/StructuredData.tsx 'src/app/[locale]/layout.tsx' src/messages/es.json src/messages/en.json tests/e2e/i18n.spec.ts tests/e2e/legal-auth.spec.ts
git commit -m "feat(public): align legal, auth, metadata and i18n"
```

---

## Task 12: Localize all product photography and remove remote hosts

**Files:**

- Create: `public/assets/images/products/*.jpg` (one per current curated product slug)
- Modify: `src/lib/product-images.ts`
- Modify: `src/app/[locale]/products/page.tsx`
- Modify: `src/app/[locale]/products/[slug]/page.tsx`
- Modify: `src/app/[locale]/products/[slug]/ficha-tecnica/page.tsx`
- Modify: `next.config.ts`
- Create: `tests/e2e/assets.spec.ts`

**Step 1: Write the failing asset test**

```ts
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { mockCatalog, prepare } from './fixtures';

test('no remote Pexels/Unsplash hosts remain in public source or next config', () => {
  const files = [
    'src/lib/product-images.ts',
    'next.config.ts',
    'src/app/[locale]/page.tsx',
    'src/app/[locale]/products/page.tsx',
    'src/app/[locale]/products/[slug]/page.tsx',
    'src/components/sections/Hero.tsx',
    'src/components/sections/SeafoodLinesSection.tsx',
  ];

  for (const file of files) {
    const content = readFileSync(join(process.cwd(), file), 'utf8');
    expect(content, file).not.toMatch(
      /images\.unsplash\.com|images\.pexels\.com|plus\.unsplash\.com/
    );
  }
});

test('product cards resolve local images even when the API returns a broken stored URL', async ({
  page,
}) => {
  await prepare(page);
  await mockCatalog(page);
  await page.goto('/products');

  const image = page.getByTestId('product-card').first().locator('img');
  const src = await image.getAttribute('src');
  expect(decodeURIComponent(src ?? '')).toContain('/assets/images/products/');
});

test('home only loads local images', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const sources = await page
    .locator('img')
    .evaluateAll(nodes => nodes.map(node => (node as HTMLImageElement).getAttribute('src') ?? ''));
  expect(sources.length).toBeGreaterThan(0);
  expect(sources.every(src => src.startsWith('/'))).toBe(true);
});
```

**Step 2: Run and verify failure**

```bash
pnpm test:e2e tests/e2e/assets.spec.ts
```

Expected: FAIL on remote URLs and broken stored paths.

**Step 3: Download all product images**

Use the current `PRODUCT_IMAGES` keys in `src/lib/product-images.ts`. For each key, download the current URL to:

```text
public/assets/images/products/<slug>.jpg
```

Overrides for the three marine products:

```bash
curl -L 'https://images.pexels.com/photos/2714384/pexels-photo-2714384.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80' -o public/assets/images/products/camaron-blanco-premium.jpg
curl -L 'https://images.pexels.com/photos/11048741/pexels-photo-11048741.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80' -o public/assets/images/products/larvas-camaron-postlarva.jpg
curl -L 'https://images.pexels.com/photos/14062107/pexels-photo-14062107.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80' -o public/assets/images/products/atun-fresco-pacifico.jpg
```

Catalog category fallbacks:

- `agricolas` → `/assets/images/products/banano-cavendish-premium.jpg`
- `marinos-y-pesca` → `/assets/images/products/atun-fresco-pacifico.jpg`
- `otros-productos` → `/assets/images/products/rosas-rojas-premium.jpg`
- final fallback → `/assets/images/products/banano-cavendish-premium.jpg`

Verify every file:

```bash
file public/assets/images/products/*.jpg
du -sh public/assets/images/products
```

Expected: all JPEG, no HTML error pages, no file under 10 KB.

**Step 4: Rewrite `product-images.ts`**

- Remove `BASE`, `Q`, and every remote URL.
- `PRODUCT_IMAGES` maps slug → `/assets/images/products/<slug>.jpg`.
- `CATEGORY_IMAGES` maps category slug → local path.
- Change the signature to:

```ts
export function getProductImage(slug: string, categorySlug?: string): string;
```

- Delete the `storedUrl` priority. Stored DB paths are known-broken and must never win over the local curated map.
- Update all call sites to two arguments:
  - `src/app/[locale]/products/page.tsx`
  - `src/app/[locale]/products/[slug]/page.tsx` (including metadata)
  - `src/app/[locale]/products/[slug]/ficha-tecnica/page.tsx`

**Step 5: Remove remote image hosts**

In `next.config.ts`, delete every `remotePatterns` entry for Unsplash, Pexels, `zivahinternational.com`, and localhost. Set:

```ts
remotePatterns: [],
```

Keep `formats`, `deviceSizes`, `dangerouslyAllowSVG`, and the SVG CSP because the local world map is an SVG.

**Step 6: Run and verify**

```bash
pnpm test:e2e tests/e2e/assets.spec.ts
pnpm test:e2e tests/e2e/products.spec.ts tests/e2e/product-detail.spec.ts
```

Expected: all pass. Product detail now resolves the local camaron image.

**Step 7: Format and commit**

```bash
pnpm exec prettier --write src/lib/product-images.ts next.config.ts 'src/app/[locale]/products/page.tsx' 'src/app/[locale]/products/[slug]/page.tsx' 'src/app/[locale]/products/[slug]/ficha-tecnica/page.tsx' tests/e2e/assets.spec.ts
git add src/lib/product-images.ts next.config.ts 'src/app/[locale]/products/page.tsx' 'src/app/[locale]/products/[slug]/page.tsx' 'src/app/[locale]/products/[slug]/ficha-tecnica/page.tsx' tests/e2e/assets.spec.ts public/assets/images/products
git commit -m "perf(public): localize photography and remove remote image hosts"
```

---

## Task 13: Accessibility, responsive checks, visual review, and final verification

**Files:**

- Modify: `package.json` / `pnpm-lock.yaml` (`@axe-core/playwright` dev dependency)
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `tests/e2e/visual.spec.ts`
- Modify: `tests/e2e/fixtures.ts` if helper signatures need tightening
- Modify: any components with axe findings

**Step 1: Add axe**

```bash
pnpm add -D @axe-core/playwright
```

**Step 2: Write failing accessibility and responsive tests**

`tests/e2e/accessibility.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { mockCatalog, mockQuoteApis, prepare } from './fixtures';

const pages = ['/', '/products', '/quote', '/contact'];

for (const path of pages) {
  test(`has no WCAG A/AA violations on ${path}`, async ({ page }) => {
    await prepare(page);
    if (path === '/products') await mockCatalog(page);
    if (path === '/quote') await mockQuoteApis(page);
    await page.goto(path);

    if (path === '/products') {
      await expect(page.getByTestId('product-card')).toHaveCount(4);
    }
    if (path === '/quote') {
      await expect(page.getByRole('button', { name: 'Enviar solicitud' })).toBeVisible();
    }

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

test('every public page has exactly one h1', async ({ page }) => {
  await prepare(page);

  for (const path of pages) {
    if (path === '/products') await mockCatalog(page);
    if (path === '/quote') await mockQuoteApis(page);
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  }
});

test('dark mode home has no WCAG A/AA violations', async ({ page }) => {
  await prepare(page);
  await page.goto('/');
  await page.evaluate(() => document.documentElement.classList.add('dark'));

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

`tests/e2e/responsive.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

import { mockCatalog, mockQuoteApis, prepare } from './fixtures';

for (const path of ['/', '/products', '/quote', '/contact']) {
  for (const width of [375, 768, 1024, 1440]) {
    test(`no horizontal overflow on ${path} at ${width}px`, async ({ page }) => {
      await prepare(page);
      if (path === '/products') await mockCatalog(page);
      if (path === '/quote') await mockQuoteApis(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
}

test('mobile home CTA is full width and touch targets are at least 44px', async ({ page }) => {
  await prepare(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const cta = page.getByRole('link', { name: 'Solicitar cotización FOB' });
  const box = await cta.boundingBox();
  expect(box?.width).toBeGreaterThan(300);
  expect(box?.height).toBeGreaterThanOrEqual(44);
});

test('mobile drawer is reachable and closes with Escape', async ({ page }) => {
  await prepare(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  await page.getByRole('button', { name: /abrir menú/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});
```

`tests/e2e/visual.spec.ts`:

```ts
import { test } from '@playwright/test';

import { mockCatalog, mockQuoteApis, prepare } from './fixtures';

test('capture public screenshots', async ({ page }) => {
  await prepare(page);

  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
    await page.goto('/');
    await page.screenshot({
      path: `test-results/screenshots/home-light-${width}.png`,
      fullPage: true,
    });
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(250);
    await page.screenshot({
      path: `test-results/screenshots/home-dark-${width}.png`,
      fullPage: true,
    });
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
  }

  await mockCatalog(page);
  await page.goto('/products');
  await page.screenshot({ path: 'test-results/screenshots/products-1440.png', fullPage: true });

  await mockQuoteApis(page);
  await page.goto('/quote');
  await page.screenshot({ path: 'test-results/screenshots/quote-1440.png', fullPage: true });
});
```

**Step 3: Run the tests and fix findings**

```bash
pnpm test:e2e tests/e2e/accessibility.spec.ts
pnpm test:e2e tests/e2e/responsive.spec.ts
pnpm test:e2e tests/e2e/visual.spec.ts
```

Expected: accessibility and responsive tests pass. Fix contrast, missing labels, duplicate landmarks, focus order, or overflow in the affected components. Do not suppress axe rules.

**Step 4: Inspect screenshots**

Open:

- `test-results/screenshots/home-light-1440.png`
- `test-results/screenshots/home-dark-1440.png`
- `test-results/screenshots/home-light-375.png`
- `test-results/screenshots/home-dark-375.png`
- `test-results/screenshots/products-1440.png`
- `test-results/screenshots/quote-1440.png`

Check: hero does not look like a stock template, no overlapping cookie/WhatsApp, no horizontal scroll, serif/sans pairing is clear, accent only on CTAs/eyebrows/active states, cards are quiet, and the mobile hero CTA is full width.

**Step 5: Run the complete suite**

```bash
pnpm test:e2e
```

Expected: all tests pass.

**Step 6: Verify lint, types, formatting, build, and diff**

```bash
pnpm format:check
pnpm type-check
pnpm lint
pnpm build
git diff --check
```

Fix any failures. Do not run `git add -A`.

**Step 7: Verify admin/API untouched**

```bash
git diff --stat main -- src/app/admin src/app/api prisma
```

Expected: no output. `src/app/api` must not change. If `src/lib/validation.ts` or other shared modules changed, confirm the diff is limited to public UI needs.

**Step 8: Lighthouse mobile check on the production build**

Start the production server in a separate shell:

```bash
PORT=3200 pnpm start
```

Run Lighthouse:

```bash
pnpm dlx lighthouse http://127.0.0.1:3200/ \
  --only-categories=performance \
  --form-factor=mobile \
  --screenEmulation.mobile \
  --throttling-method=simulate \
  --chrome-flags="--headless --no-sandbox" \
  --output=json \
  --output-path=/tmp/zivah-lighthouse.json
```

Parse the result:

```bash
node -e "const r=require('/tmp/zivah-lighthouse.json'); console.log({lcp:r.audits['largest-contentful-paint'].displayValue, cls:r.audits['cumulative-layout-shift'].displayValue, score:r.categories.performance.score})"
```

Expected: LCP < 2.5 s, CLS < 0.1, performance score ≥ 0.9. If Lighthouse cannot run in this environment, report the exact blocker and do not claim the target was met.

**Step 9: Commit test coverage**

```bash
pnpm exec prettier --write tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts tests/e2e/visual.spec.ts tests/e2e/fixtures.ts package.json
git add tests/e2e/accessibility.spec.ts tests/e2e/responsive.spec.ts tests/e2e/visual.spec.ts tests/e2e/fixtures.ts package.json pnpm-lock.yaml
git commit -m "test(public): add accessibility and responsive verification"
```

If axe fixes touched components, stage those explicit files in the same commit or a preceding `fix(public):` commit.

---

## Acceptance mapping

| Spec criterion                                                                                 | Covered by                                             |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Home has no carousel, autoplay, side panel, blue stats strip, newsletter, or testimonial cards | Tasks 3–4, `home.spec.ts`                              |
| Home leads with seafood and agricultural lines are secondary text                              | Task 3, `home.spec.ts`                                 |
| One dominant CTA and no duplicate quote nav item                                               | Tasks 2, 9; shell/quote tests                          |
| Approved tokens and typography in light/dark                                                   | Task 1, `design-system.spec.ts`, visual screenshots    |
| No emoji as icons                                                                              | Tasks 2, 7, 8, 10, 11; source and page assertions      |
| No remote Pexels/Unsplash images                                                               | Task 12, `assets.spec.ts`                              |
| Complete ES/EN copy without voseo                                                              | Task 11, `i18n.spec.ts`                                |
| WCAG AA and keyboard navigation                                                                | Task 13, `accessibility.spec.ts`, `responsive.spec.ts` |
| Lighthouse LCP/CLS                                                                             | Task 13, production Lighthouse step                    |
| Format, types, lint, build, diff check                                                         | Task 13                                                |
| Admin/API unchanged                                                                            | Working rules, Task 13 diff check                      |

## Risks and notes

- **No local PostgreSQL is required.** All browser pages are mocked. Product detail and ficha use the stub API on port 4010. Do not point `NEXT_PUBLIC_SITE_URL` at a real server for tests.
- **Stored product image paths are broken.** `getProductImage` must ignore `storedUrl`; otherwise the catalog shows `public/assets/images/products/*.jpg` paths that do not exist.
- **Legal body copy stays in Spanish.** The `/en` legal pages show a localized notice. Translating legal documents is out of scope and would create unofficial legal text.
- **`AGENTS.md` is intentionally dirty.** Never stage it. Explicit-path commits are mandatory.
- **The logo SVG is large** and out of scope to redesign. Do not replace it; keep the existing asset and dimensions.
- **Dark mode and print** must both be checked because the technical sheet is a white document inside the dark public shell.
- **No new dependencies except `@axe-core/playwright`**, which is test-only. Do not add a carousel, animation, icon, or UI library.
