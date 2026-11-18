# Quickstart: Quote Flow Validation

This guide is for the implementation and review phase. It uses a disposable/local PostgreSQL database only; do not point schema-push commands at production.

## Preconditions

- Node.js and `pnpm` are installed as specified by the repository.
- Dependencies are installed from the checked-in lockfile.
- A disposable/local PostgreSQL database is configured through the existing local environment without printing or copying credentials.
- Catalog fixtures include USD, kg, t, an active kg↔t compatibility, one priced continuous product, one unpriced product, and one discrete package/container measure.

## Schema and generated types

```bash
pnpm db:push
pnpm db:generate
```

Run these only against the disposable/local database. Confirm existing integer quantities survive the schema change, canonical decimal quantities are stored exactly, widened amounts remain exact, and new unpriced line values can be stored as absent.


## Focused verification

```bash
pnpm type-check
pnpm lint
pnpm test:e2e tests/e2e/quote.spec.ts tests/e2e/quote-pricing.spec.ts tests/e2e/quote-email.spec.ts tests/e2e/quote-server.spec.ts tests/e2e/subscription-email.spec.ts --workers=1
pnpm build
git diff --check
```

`tests/e2e/quote-server.spec.ts` also runs its database integration scenario when `QUOTE_TEST_DATABASE_URL` points to the isolated local fixture at `127.0.0.1:55432/zivah_quotes_test`. Set the app's `DATABASE_URL` to that same disposable database and configure email delivery to a local closed SMTP port; the scenario verifies the stored `emailSent: false` result without sending a real message. The in-memory server-contract and email-renderer cases run without this database.

The quote checks use controlled catalog values and cover:

1. USD price per kg converted to a tonne price using the normalized kg→t factor, with a `1.5 t` line; assert exact decimal-string unit and line totals.
2. Reverse t→kg conversion and direct target-unit price precedence.
3. Inactive/future prices, missing prices, inactive/missing conversion factors, and incompatible kg↔L measures.
4. Fractional continuous quantities up to three places, localized decimal display, and rejection of fractional count/package/container quantities.
5. A converted rational unit price with fractional cents and a larger quantity; `BigInt` arithmetic multiplies before half-up line rounding, with no floating-point cent drift.
6. Manipulated client price fields; saved amount uses the catalog result.
7. Required destination and 429/load failure recovery without request loops.
8. Spanish and English email output, text and HTML parity, unpriced lines, escaping, responsive width, and truthful `emailSent` messaging.
9. Spanish and English subscription welcome emails preserve their subject and message, escape optional names, follow the approved email design rules, and render without horizontal overflow at 320 and 600 px.

## Review boundaries

- Inspect the generated customer and business-copy payloads without sending real email or exposing credentials.
- Capture subscription email content with a mocked transport; do not send real subscription email during validation.
- Browser rendering verifies the email markup at mobile and desktop widths; this does not claim full Gmail/Outlook-client certification.
- Do not apply a production schema change or claim deployment completion from local schema validation.
