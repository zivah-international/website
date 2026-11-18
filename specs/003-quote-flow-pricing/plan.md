# Implementation Plan: Cotización B2B fiable y correo de solicitud

**Branch**: `[feat/public-site-redesign-integration]` | **Date**: 2026-11-17 (scope amendment) | **Spec**: [spec.md](spec.md)

**Input**: Approved feature specification at `specs/003-quote-flow-pricing/spec.md`.

## Summary

Make catalog pricing and unit conversions consistent from product search through form, stored quote, and bilingual email. The server will revalidate each product, unit, active/effective price, and conversion; the browser will show the same deterministic estimate without treating client prices as authoritative. Continuous measures accept up to three decimal places, while discrete counts, packages, and containers remain integers. Unpriced items remain requestable and are represented as pending amounts. The quote email becomes a request-received acknowledgment, and the existing subscription welcome email is visually aligned with the same institutional/editorial redesign while preserving its delivery behavior and message.

## Technical Context

**Language/Version**: TypeScript 6.0.3; Next.js 16.4.6 App Router; React 19.3.1.

**Primary Dependencies**: PostgreSQL through `pg` 8.23.1 at runtime; Zod 4.6.7 for request validation; Nodemailer 9.1.1 for email; Prisma 8.0.0-rc.33 only for schema, development database operations, and seeds.

**Storage**: PostgreSQL. Quote requests use direct parameterized SQL through `src/lib/db.ts`. Catalog prices are stored as decimal values in USD; amount and quantity values cross the API as canonical decimal strings so JSON floating-point conversion cannot change them.

**Testing**: Playwright 1.65.0 is the repository's test runner. Use deterministic pricing and server-contract tests, browser coverage for localized quote flows, and an opt-in POST integration test against a disposable local PostgreSQL fixture with a fake local SMTP endpoint.

**Target Platform**: Standalone Node.js application on cPanel/CloudLinux.

**Project Type**: Full-stack Next.js monolith with public App Router pages and internal API Route Handlers.

**Performance Goals**: Preserve existing rate limits and avoid per-product price lookup queries in product search; load product, unit, compatibility, and price data in bounded/batched queries. No new latency target is introduced.

**Constraints**: Never import Prisma Client in application code. Validate API input with Zod and use parameterized SQL. Do not accept client-submitted prices as authoritative. Do not invent prices, convert currencies, add tax or freight, or claim commercial validity. Preserve the current public quote page layout. Use email-client-safe markup and the current design tokens for both in-scope templates; preserve the subscription welcome email's subject, meaning, locale and delivery trigger, and escape its optional subscriber name.

**Scale/Scope**: One public quote flow and its receipt email in Spanish and English; product search, measure data, request persistence, quote status response, and the internal BCC copy; plus a visual update to the existing Spanish/English subscription welcome email. No subscription-flow, delivery-trigger, API, or other email-template changes are included.

## Constitution Check

| Constitution rule | Plan decision | Result |
|---|---|---|
| Full-stack Next.js monolith deployed as cPanel standalone | Keep the current App Router page and internal Route Handlers; no Vercel-specific runtime features | Pass |
| Runtime data access uses `pg`; Prisma is development/migration tooling only | Recalculate and persist quote values with parameterized `pg` queries; update Prisma schema for schema tooling only | Pass |
| Strict Zod validation for API inputs | Align client and server quote schemas for measure-specific precision, quantity limits, and required destination | Pass |
| Spanish copy with English localization | Keep all new form status, validation, and email text in `src/messages/es.json`, `src/messages/en.json`, and localized email strings | Pass |
| Reuse existing UI primitives and design tokens | Preserve `QuoteForm` layout and public design; no UI library is introduced | Pass |
| Do not expose credentials or local configuration | No environment files or credentials are part of the plan or artifacts | Pass |

**Pre-design gate**: Pass. The design stays within the current monolith and existing UI/email stack.

## Project Structure

### Documentation (this feature)

```text
specs/003-quote-flow-pricing/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── quotes-api.md
└── tasks.md                 # Created only after plan approval
```

### Source Code

```text
src/app/[locale]/quote/page.tsx
src/app/api/quotes/route.ts
src/app/api/quotes/measures/route.ts
src/app/api/quotes/products/search/route.ts
src/components/QuoteForm.tsx
src/lib/validation.ts
src/lib/validations/index.ts
src/lib/services/pricing.service.ts
src/lib/services/product.service.ts
src/lib/db-schemas.ts
src/lib/email.ts
src/messages/es.json
src/messages/en.json
prisma/schema.prisma
tests/e2e/quote.spec.ts
```

**Structure Decision**: Keep the existing single Next.js application. Centralize unit conversion and money arithmetic in a small shared helper using scaled `BigInt` values and rational division, shared by the form preview and server calculation path. Keep decimal values as canonical strings at API and persistence boundaries. Keep persistence in the existing quote Route Handler and database service; do not add a separate backend or an application-level Prisma client or numeric library.

## Design Decisions

1. **Server-owned price calculation**: Catalog search may return active estimates for display, but POST recalculates from the current catalog at submission time. A direct price for the selected unit wins. If none exists, derive only from the product's base-unit price through an explicit active positive compatibility conversion. Ignore submitted prices/totals.
2. **One conversion-factor convention**: Normalize each allowed relation to “target units per source unit.” A source-unit price divided by that normalized factor gives the target-unit price. If only the reverse relation is active, invert its factor. Same-family membership alone is insufficient. Apply the convention consistently to the client preview and server calculation.
3. **Quantity and price precision**: Accept canonical decimal-string quantities up to 10,000, with at most three decimal places for continuous measure types and whole values for count/package/container types. Parse catalog prices and conversion factors from PostgreSQL decimal strings. Use scaled `BigInt` arithmetic and rational division for both preview and server calculation; do not convert monetary values to JavaScript `number`. Multiply the unrounded rational converted rate by quantity, round each line total half-up to USD cents once, then sum line totals. Store a converted unit-price snapshot rounded to six decimal places for display and reconciliation; keep amount values as decimal strings in API responses and email payloads.
4. **Missing prices**: Persist nullable line amounts rather than fabricated zeros. Store a quote total only when every line is priced. Preserve existing rows as-is; do not reinterpret legacy zero amounts because the stored value cannot distinguish a real zero from the old fallback.
5. **Quote email as receipt**: Keep the existing BCC to the business team, but make subject/opening a request acknowledgment. Send equivalent plain-text and HTML bodies, include units/notes/specifications, label available catalog values as estimates, and omit a total when any line is unpriced. Use the exact current public palette and system-safe font fallbacks; escape dynamic content and remove the unsupported 30-day claim.
6. **Schema change boundary**: Change `QuoteItem.quantity` to `numeric(13,3)`, make its amount fields nullable, widen the unit-rate snapshot to `numeric(24,6)`, and widen line and quote totals to `numeric(30,2)`. These ranges retain existing values and cover the maximum catalog price (`numeric(10,2)`), conversion factor (`numeric(15,6)`, including its inverse), and per-line quantity cap (10,000) with headroom. Apply a forward-only schema change that preserves existing integer quantities and stored values. The repository currently has no checked-in Prisma migration history, and the cPanel deployment workflow copies the schema without showing a migration execution step. This plan validates against a disposable/local database and does not claim that a production schema update was applied.
7. **Subscription welcome email**: Keep its current subject, translated message meaning, and send trigger. Restyle its HTML with email-safe inline markup using the approved paper/white/navy/terracotta palette, serif/sans-serif fallbacks, hairline separators and restrained corners; omit gradients, drop shadows and side-tab accents. Escape the optional subscriber name and keep the greeting readable when it is absent.

## Constitution Check (post-design)

| Check | Result |
|---|---|
| Uses `pg` and parameterized SQL for all runtime reads/writes | Pass |
| Prisma is limited to schema/migration/seed tooling | Pass |
| API schemas enforce all unit, amount, locale, and destination rules | Pass |
| No user-facing text is added outside Spanish/English locale sources | Pass |
| No competing UI or email framework is introduced | Pass |
| cPanel standalone remains the deployment target | Pass |

No constitution violations require complexity exceptions.

## Complexity Tracking

None.
