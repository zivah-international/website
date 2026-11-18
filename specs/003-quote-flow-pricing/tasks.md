# Tasks: Cotización B2B fiable y correo de solicitud

**Input**: Design documents from `/specs/003-quote-flow-pricing/`

**Prerequisites**: Approved `spec.md` and `plan.md`; `research.md`, `data-model.md`, `contracts/quotes-api.md`, and `quickstart.md`.

**Tests**: Included because the requested work explicitly checks quote calculations and the approved spec defines calculation, API, and email acceptance scenarios.

**Organization**: Tasks are grouped by the three user stories in `spec.md`.

## Phase 1: Setup

**Purpose**: Project initialization and basic structure.

No bootstrap tasks are needed; the existing Next.js application and Playwright configuration are in place.

---

## Phase 2: Foundational

**Purpose**: Prepare storage and database validation for all quote stories.

- [x] T001 Update `prisma/schema.prisma` and `src/lib/db-schemas.ts` so quote quantity uses `numeric(13,3)`, quote-item unit price is nullable `numeric(24,6)`, line total is nullable `numeric(30,2)`, and quote total is `numeric(30,2)` while preserving existing stored values and nullable behavior.

**Checkpoint**: Storage types support fractional quantities, precise converted unit rates, and absent amounts for unpriced lines.

---

## Phase 3: User Story 1 - Preparar una solicitud con importes claros (Priority: P1) 🎯 MVP

**Goal**: Show an accurate USD estimate for eligible catalog prices, support continuous fractional quantities and valid unit conversions, and keep unpriced requests possible.

**Independent Test**: Use mocked product, measure, and country APIs to submit a request with `1.5 t` from a USD-per-kg price; verify the converted rate and line amount, localized decimals, discrete-quantity validation, missing-price behavior, required country, and recovery from failed or limited data loads.

### Tests for User Story 1

- [x] T002 [P] [US1] Add deterministic pricing cases in `tests/e2e/quote-pricing.spec.ts` for direct prices, normalized forward and reverse conversions, direct-price precedence, exact fractional quantities, half-up line rounding, and Spanish/English decimal formatting.
- [x] T003 [P] [US1] Extend mocked quote-flow coverage in `tests/e2e/quote.spec.ts` and `tests/e2e/fixtures.ts` for the `1.5 t` preview, pending prices without a false total, incompatible measures, continuous versus discrete quantities, required destination, and recoverable load/429 errors without automatic retry loops.

### Implementation for User Story 1

- [x] T004 [US1] Implement `src/lib/quote-pricing.ts` with canonical decimal parsing, scaled `BigInt` arithmetic, rational conversion-factor normalization/inversion, direct-price precedence, six-place unit-rate snapshots, half-up cent rounding, and locale-aware quantity and amount formatting.
- [x] T005 [P] [US1] Align `src/app/api/quotes/measures/route.ts` and `src/app/api/quotes/products/search/route.ts` with `specs/003-quote-flow-pricing/contracts/quotes-api.md`: return camelCase measure metadata, SI mass symbols `kg`/`t`, and only active/effective direct prices and explicitly compatible measures needed for the estimate.
- [x] T006 [P] [US1] Update client quote validation and localized form copy in `src/lib/validations/index.ts`, `src/messages/es.json`, and `src/messages/en.json` for canonical decimal quantities, the 10,000 per-line maximum, three decimals for continuous measures, integers for discrete measures, required country, pending prices, and load errors.
- [x] T007 [US1] Update `src/components/QuoteForm.tsx` to consume the measure and pricing contracts, calculate previews with `src/lib/quote-pricing.ts`, display `kg`/`t` and USD estimates accurately, preserve permitted fractions, omit incomplete totals, and provide clear load recovery without unbounded retries.

**Checkpoint**: The public form previews consistent estimates and permits valid requests without relying on prices from the browser as final values.

---

## Phase 4: User Story 2 - Recibir una confirmación de solicitud coherente (Priority: P2)

**Goal**: Send a bilingual receipt that matches the request, distinguishes estimates from a formal offer, and remains readable in common email clients.

**Independent Test**: Render a controlled receipt payload in Spanish and English; compare HTML and plain-text values, inspect an unpriced line, verify escaping and the existing business BCC, and check the layout at mobile and desktop widths.

### Tests for User Story 2

- [x] T008 [P] [US2] Add email rendering cases in `tests/e2e/quote-email.spec.ts` for Spanish/English parity, escaped customer and catalog data, line units/notes/specifications, estimate wording, omission of totals for unpriced lines, plain-text content, the existing business BCC, and responsive markup.

### Implementation for User Story 2

- [x] T009 [US2] Redesign `src/lib/email.ts` as a request-received acknowledgment with equivalent HTML and plain-text bodies, inline email-safe layout using `#F6F4EF`, white, `#0B2239`, `#C0451F`, Newsreader/Georgia and Inter/Arial fallbacks, escaped dynamic content, estimated USD values, no unsupported 30-day validity, no gradients or decorative emoji, and the current business BCC.

**Checkpoint**: The email renderer produces the complete bilingual receipt from a validated payload and does not present it as a formal quote.

---

## Phase 5: User Story 3 - Mantener una cotización íntegra para el equipo comercial (Priority: P3)

**Goal**: Recalculate quote amounts from current server-side catalog data, persist the same values shown to the customer, and report email delivery truthfully.

**Independent Test**: Submit controlled requests against a disposable database while stubbing email delivery; verify that altered client prices are ignored, active/effective prices and explicit conversions are recalculated, unavailable prices remain pending, invalid conversions are rejected, and stored/email amounts match.

### Tests for User Story 3

- [x] T010 [P] [US3] Add server quote scenarios in `tests/e2e/quote-server.spec.ts` using a disposable catalog fixture and stubbed email transport for manipulated price fields, active/inactive/future prices, compatible/incompatible units, fractional/discrete quantities, nullable unpriced amounts, required country, locale preservation, and `emailSent` outcomes.

### Implementation for User Story 3

- [x] T011 [US3] Align server validation in `src/lib/validation.ts` with the approved request contract: require `countryId`, preserve `locale`, accept only positive canonical decimal-string quantities up to 10,000 with measure-specific precision, and ignore legacy/client-supplied unit and line prices.
- [x] T012 [US3] Update `src/app/api/quotes/route.ts` and `src/lib/services/pricing.service.ts` to revalidate active product, selected measure, explicit active conversion, effective date, and current price at submission; use `src/lib/quote-pricing.ts` for authoritative amounts and never trust submitted prices.
- [x] T013 [US3] Persist canonical quantity, selected measure, nullable unit and line amounts, USD currency, and quote total only when every line is priced in `src/app/api/quotes/route.ts`; keep SQL parameterized and preserve the request when email delivery fails.
- [x] T014 [US3] Update `src/lib/services/product.service.ts` and the quote response mapping in `src/app/api/quotes/route.ts` to handle nullable numeric strings without converting amounts through JavaScript `number`, include units/notes/specifications in the receipt payload, call the bilingual renderer from `src/lib/email.ts`, and return the actual `emailSent` status.

**Checkpoint**: The stored request, customer receipt, and business copy use server-calculated values and show pending amounts honestly.

---

## Phase 7: User Story 4 - Alinear el correo de bienvenida de suscripción (Priority: P4)

**Goal**: Apply the approved institutional/editorial email design to the existing bilingual subscription welcome email while retaining its message and delivery behavior.

**Independent Test**: Capture Spanish and English messages with a mocked transport; verify subject, translated content, safely escaped optional name, approved inline design rules, and no horizontal overflow at 320 and 600 px.

### Tests for User Story 4

- [x] T017 [P] [US4] Add `tests/e2e/subscription-email.spec.ts` covering Spanish/English subject and content, names with HTML characters and missing names, email design rules, and responsive markup using a mocked transport and rendered viewport checks.

### Implementation for User Story 4

- [x] T018 [US4] Redesign the subscription welcome renderer and its localized greeting strings in `src/lib/email.ts` with email-safe inline styles from the approved redesign; preserve subject, message meaning, locale and send behavior, escape the optional subscriber name, and use a natural generic greeting when the name is absent.

**Checkpoint**: Both subscription locales retain their current meaning and delivery while following the approved email design; dynamic names remain plain text.

---

## Phase 8: Amendment Analysis and Verification

**Purpose**: Reconcile the new scope amendment with implementation and verify the subscription email change.

- [x] T019 Analyze the amended `spec.md`, `plan.md`, `tasks.md`, and implementation against FR-018/FR-019 and SC-011/SC-012; resolve every uncovered discrepancy.
- [x] T020 Validate the amended email behavior with `pnpm test:e2e tests/e2e/subscription-email.spec.ts --workers=1`, then run `pnpm type-check`, `pnpm lint`, `pnpm build`, changed-file Prettier, and `git diff --check`.

---

## Phase 6: Polish and Cross-Cutting Verification

**Purpose**: Reconcile implementation against the approved artifacts and verify the complete flow.

- [x] T015 Run `speckit.analyze` against `specs/003-quote-flow-pricing/spec.md`, `plan.md`, `tasks.md`, and the implementation; resolve every uncovered requirement or contract discrepancy in the feature artifacts and source files.
- [x] T016 Validate schema and quote behavior from `specs/003-quote-flow-pricing/quickstart.md` using only a disposable/local PostgreSQL database; run `pnpm format:check`, `pnpm type-check`, `pnpm lint`, focused quote Playwright coverage, `pnpm build`, and `git diff --check`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Existing project setup; no bootstrap task is required.
- **Foundational (Phase 2)**: T001 must complete before quote persistence and API schema work.
- **User Stories (Phase 3+)**: US1 and US2 can start after T001. US3 depends on T001, the shared pricing helper from T004, and the email renderer from T009.
- **Original polish (Phase 6)**: T015 and T016 followed the original three story checkpoints and are complete.
- **Amendment (Phases 7-8)**: T017 precedes T018; T019 and T020 run after the US4 checkpoint. The user approved this amendment on 2026-11-17; all four tasks are complete.

### User Story Dependencies

- **US1 (P1)**: Starts after T001; no dependency on other user stories.
- **US2 (P2)**: Starts after T001; its renderer and direct payload tests are independent of US1.
- **US3 (P3)**: Starts after T001, T004, and T009 so its POST handler can use the approved calculation and email interfaces.
- **US4 (P4)**: Independent of quote persistence and pricing; run T017 then T018 because both inspect the subscription template in `src/lib/email.ts`.

### Parallel Opportunities

- T002 and T003 can be authored in separate test files after T001.
- T005 and T006 can be implemented in parallel after T004 because they touch separate API and client-validation files.
- US1 and US2 can proceed in parallel after T001; their test and implementation files are separate.
- T010 can be authored independently of T008 while both wait for T001; T011-T014 remain sequential where they modify the quote POST path.
- T017 and T018 stay sequential because the test exercises the existing renderer before its same-file markup change; T019 and T020 follow the implementation in order.

## Parallel Example: User Stories 1 and 2

```text
After T001:
Track A: T002 -> T004 -> T005/T006 -> T007
Track B: T008 -> T009
Then: T010 -> T011 -> T012 -> T013 -> T014
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete T001.
2. Complete and verify US1 (T002-T007) with controlled API responses.
3. Confirm the form displays the `1.5 t` conversion, valid fractions, and pending-price path before continuing.

### Incremental Delivery

1. Complete the P1 form preview and validation.
2. Complete the P2 bilingual email renderer and inspect both output formats.
3. Complete the P3 server revalidation, persistence, and email integration.
4. Run the full analysis and local validation in T015-T016; do not apply schema changes to production as part of this task set.
5. The user approved the US4 amendment on 2026-11-17; T017-T020 are complete and the amended scope is verified.

## Notes

- `[P]` tasks use separate files and have no dependency on unfinished tasks.
- User-story labels trace tasks to the approved scenarios in `spec.md`.
- Use only disposable/local database fixtures; do not send real email or expose mail credentials during verification.
- Keep existing quote records, including zero values, unchanged during the schema conversion.

## Completion Evidence

- T015: The Speckit analyzer executable is not present in this repository, so the approved read-only analysis was completed manually against all 17 functional requirements and 10 success criteria. Each requirement maps to implementation and validation evidence; no uncovered contract discrepancy remains.
- T016: Prisma schema validation and `db push` ran against disposable local PostgreSQL; a legacy row retained quantity `3`, unit price `2.50`, and totals `7.50` after precision widening. Focused quote Playwright suite passed 21/21, `pnpm type-check`, `pnpm lint` (0 errors; 5 existing warnings), `pnpm build`, changed-file Prettier, and `git diff --check` passed. Repository-wide `pnpm format:check` reports only the existing `.impeccable/hook.cache.json` and `docs/wiki/_Footer.md`; neither was modified. The temporary database container was stopped after validation.
- T017: The new bilingual subscription email Playwright test first exposed the raw HTML name interpolation. After the renderer fix, it passed with Spanish/English messages, escaped names, generic greetings, approved design rules, and rendered 320/600 px checks.
- T018: `src/lib/email.ts` now renders the subscription welcome with the approved paper/white/navy/terracotta palette, serif/sans fallbacks, email-safe tables, hairline separators, responsive width, preserved subject/content meaning/delivery, and escaped subscriber names. The old side-tab, gradients, shadows, and obsolete teal colors are absent.
- T019: The repository has no Speckit analyzer executable, so the amendment was checked manually. FR-018/FR-019 and SC-011/SC-012 map to T017/T018 and passing rendered assertions; no uncovered requirement or plan/task discrepancy remains.
- T020: The combined focused Playwright run passed 21 tests; the optional PostgreSQL integration case was skipped because its disposable fixture was not configured in this run. The Playwright web server completed `pnpm build` before serving. `pnpm type-check`, `pnpm lint` (0 errors; 5 pre-existing warnings), Prettier for changed artifacts, `git diff --check`, and the Impeccable detector passed. Spanish and English desktop/mobile screenshots were inspected at 600 and 320 px; no horizontal overflow was observed. Impeccable's local CLI does not provide the requested `audit` command; its available `detect` command returned no findings.
