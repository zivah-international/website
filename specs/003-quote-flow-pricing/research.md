# Research: Cotización B2B fiable y correo de solicitud

## Decisions

### 1. Price source and effective date

**Decision**: Treat only catalog prices that are active and effective by the submission time as estimates in USD. A direct price for the selected unit takes precedence. Otherwise derive only from the product's base-unit price through an explicit active positive conversion. If there is no eligible price, keep the line requestable and show its price as pending. Do not select the first available price or invent market prices, FX, tax, or freight.

**Rationale**: `product_prices` is keyed by product and measure and has active/effective-date fields, but the current search route ignores the effective date and falls back to the first active price. The POST route currently accepts browser prices and stores zero when absent. The server must recompute from catalog state to make the form, request record, and email agree.

**Alternatives considered**: Trust the browser's displayed price (rejected because it can be modified and become stale); derive from any other active price (rejected because different measures can carry independent commercial prices); display zero for missing prices (rejected because it means “free” rather than “pending”).

### 2. Conversion factor convention

**Decision**: Normalize the allowed conversion as target units per source unit. If a source-unit price is `P` and the normalized factor is `F`, the price per target unit is `P / F`. If only the reverse relation is active, invert its factor before calculating. Require an explicit active positive relation; same-family membership alone does not establish compatibility. Preserve a direct target-unit catalog price when present.

**Rationale**: The seed's `measure_compatibility` rows encode kg→t as `0.001 t/kg` and t→kg as `1000 kg/t`. The separate `measures.conversion_factor` field is base units per displayed unit, so its direction differs. The current form applies the base factor in the wrong direction: a kg price converted to tonnes is divided by 1,000 instead of multiplied by 1,000. The implementation must normalize factor direction once and test both directions.

**Alternatives considered**: Infer convertibility from matching family (rejected because there may be no conversion factor); use arbitrary same-family prices (rejected); interpret both factor fields identically (rejected because the seed demonstrates different meanings).

### 3. Quantity and monetary precision

**Decision**: Permit up to three decimal places for continuous measure types (mass, volume, length, area); keep count, packaging, and container measures integral. Persist quantity with three decimal places. Calculate converted unit price at full factor precision and line totals before rounding; round each line total once to USD cents, then sum line totals. Store the converted unit-price snapshot with up to six decimal places so it can be reconciled with the line amount.

**Rationale**: The form currently uses `parseInt`, both client and server Zod schemas require integers, and `QuoteItem.quantity` is an integer. The user approved fractional quantities when the measure allows them. PostgreSQL `numeric` provides exact decimal storage and arithmetic where possible; rounding a converted unit price to cents before multiplying can change a high-quantity subtotal by more than one cent.

**Alternatives considered**: Keep all quantities integral (rejected because `1.5 t` cannot be expressed); use binary floating-point for price arithmetic (rejected because it can introduce cent drift); round each converted unit rate to cents before multiplication (rejected because line totals can diverge for larger quantities).

### 4. Unpriced lines and existing records

**Decision**: New unpriced quote lines have absent unit and line amounts; the quote total is absent if any line is unpriced. Keep the request itself valid. Do not rewrite historical zero amounts during the schema change.

**Rationale**: `quotes.total_amount` is nullable, but `quote_items.unit_price` and `total_price` are currently required and the route stores zeros for missing prices. A historical zero cannot be distinguished from a legitimate zero catalog value using the stored amount alone.

**Alternatives considered**: Rewrite every historical zero to null (rejected without a data decision because it can alter legitimate values); display a partial sum as the quote total (rejected because it hides unpriced items).

### 5. Email design and content

**Decision**: Render a request acknowledgment in Spanish or English, with both plain text and HTML. Preserve the existing business BCC. Include units, quantity, notes/specifications, available estimated prices, contact/destination, request reference, and the total only when every line is priced. Escape customer/catalog text and validate email link targets. Remove the unsupported 30-day validity statement. Use the public redesign's light palette, restrained accent, serif heading, and sans-serif body; keep the layout compact and email-client tolerant.

**Rationale**: The current template uses a blue gradient, emoji, legacy colors, and a 30-day claim; it has no plain-text body and interpolates user data without escaping. Its API mapping omits the unit, phone, notes, and specifications. The current public design defines a calmer warm-paper/navy/accent system.

**Alternatives considered**: Keep the current “quote issued” wording (rejected because this email only confirms receipt); retain the 30-day claim (rejected because no approved price-validity policy exists); HTML-only (rejected because a plain-text version is part of the agreed email behavior).

### 6. API and database architecture

**Decision**: Keep the Next.js Route Handlers and the established `pg` runtime path. Validate requests with Zod. Use Prisma only for schema and database tooling. Expose a consistent camelCase unit contract and make the server independently revalidate submitted product/unit/quantity values.

**Rationale**: The repository constitution explicitly forbids Prisma Client in application code and requires parameterized `pg` calls. The current measure endpoint sends raw snake_case while the form expects camelCase; the current product search omits canonical measure metadata. The repository has no checked-in `prisma/migrations/` directory, and the cPanel workflow copies the schema but does not show migration execution.

**Alternatives considered**: Add a separate backend service or use Prisma in the route handler (rejected as unnecessary and against the constitution); claim production migration execution from the cPanel workflow (rejected because the checked-in workflow does not show it).

## Verified repository observations

- Package versions: Next.js 16.4.6, React 19.3.1, TypeScript 6.0.3, Zod 4.6.7, `pg` 8.23.1, Nodemailer 9.1.1, Prisma 8.0.0-rc.33.
- Quote E2E tests currently cover page layout, empty-submit validation, and English validation only.
- `Measure` has measure type, base unit, and base conversion factor but no separate “allows fractions” flag. The rule is therefore explicit by continuous/discrete measure category.
- Seeded SI units include kg and metric tonne; the tone's SI symbol is `t` though the legacy short name is `MT`. Display `t` in the public flow.
- Currency `USD` is seeded. Product prices have no currency column; the approved behavior treats catalog prices as USD.
- The form sends locale, but the POST sanitizer must preserve it so the English request produces an English email.
- `emailSent` is returned by the POST route, but current success copy always says the email was sent.
- The country is labeled required in the UI and required by the API schema, while the client schema currently leaves it optional.

## Sources

### Project sources

- [Public redesign specification](../../docs/superpowers/specs/2026-10-20-public-site-redesign-design.md) — visual tokens, Newsreader/Inter typography, contrast, and institutional/editorial direction.
- `src/components/QuoteForm.tsx`, `src/lib/validation.ts`, `src/lib/validations/index.ts` — current form math, client/server validation, and locale handling.
- `src/app/api/quotes/route.ts`, `src/app/api/quotes/products/search/route.ts`, `src/app/api/quotes/measures/route.ts` — current request, search, and measure contracts.
- `src/lib/services/pricing.service.ts`, `prisma/schema.prisma`, `prisma/seed.ts` — catalog price, conversion factors, and persistence definitions.
- `src/lib/email.ts`, `src/messages/es.json`, `src/messages/en.json` — existing email and localized UI text.
- `.specify/memory/constitution.md`, `docs/wiki/Database-Architecture.md`, `.github/workflows/deploy.yml` — architecture constraints and schema/deployment boundaries.

### Official guidance

- [INEN Sistema Internacional de Unidades brochure (2026)](https://www.normalizacion.gob.ec/wp-content/uploads/downloads/2026/02/Brochure_Sistema-Internacional-de-Unidades-1.pdf) and [INEN unit-writing rules](https://www.normalizacion.gob.ec/como-lograr-uniformidad-en-el-uso-correcto-del-sistema-internacional-de-unidades-mediante-las-reglas-de-escritura/) — SI symbols, spacing, and Ecuadorian measurement conventions.
- [PostgreSQL numeric types](https://www.postgresql.org/docs/current/datatype-numeric.html) — exact decimal storage and arithmetic for monetary and precision-sensitive values.
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) — current App Router request/response convention; local Next 16 docs were also reviewed at `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`.
- [Nodemailer message fields](https://nodemailer.com/message) — separate `text` and `html` message bodies.
- [Gmail CSS support](https://developers.google.com/workspace/gmail/design/css), [Microsoft email rendering guidance](https://learn.microsoft.com/en-us/troubleshoot/dynamics-365/customer-insights/journeys/email/email-troubleshoot-rendering), and [W3C data table tutorial](https://www.w3.org/WAI/tutorials/tables/) — conservative email CSS, responsive table testing, and accessible table headers.
