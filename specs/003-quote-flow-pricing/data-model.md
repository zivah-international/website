# Data Model: Cotización B2B fiable

## Quote

| Attribute | Contract | Notes |
|---|---|---|
| Request reference | Existing unique quote number | Included in customer and business email |
| Contact and destination | Name, email, optional phone/company, required country | Country is validated by client and server |
| Locale | `es` or `en` | Applies to receipt email and user-facing result |
| Estimated total | USD decimal string or pending/null | Only present when every line has a priced amount; database/API precision is `numeric(30,2)`/canonical decimal string |
| Email outcome | Sent/failed state and timestamp | Request remains stored if email delivery fails |

## QuoteItem

| Attribute | Contract | Storage change |
|---|---|---|
| Product | Existing product relation | Must be active and requestable |
| Measure | Selected compatible measure | Must be the product base measure or have an explicit active conversion |
| Quantity | Positive decimal string ≤10,000; up to 3 decimals for continuous measures, integer for discrete measures | Store as `numeric(13,3)`; this preserves existing integer rows and the accepted range |
| Unit price | Direct or converted USD estimate; snapshot rounded to 6 decimal places | Nullable `numeric(24,6)` for an unpriced line; retain full rational precision during line calculation |
| Line total | USD decimal string rounded to cents after full-precision rate × quantity | Nullable `numeric(30,2)` for an unpriced line |
| Notes/specifications | Customer-provided line details | Included safely in the receipt and business copy |

The maximum direct price is bounded by the existing `ProductPrice.price numeric(10,2)`. A compatibility factor is `numeric(15,6)`; either its direct value or its inverse can scale a rate by up to about 10^9. Therefore the converted rate is bounded below 10^18 USD per target unit, which fits `numeric(24,6)`. Multiplying by the accepted maximum quantity of 10,000 remains below 10^22, which fits `numeric(30,2)` with room for the quote total. Keep numeric values as decimal strings outside PostgreSQL; never route them through JavaScript `number` for arithmetic or serialization.

## Product and measure

- A product has a base measure when configured.
- Continuous measure categories are mass, volume, length, and area. They accept up to three decimal places.
- Discrete categories are count, package, and container. They accept whole positive quantities only.
- The public display prioritizes `kg` and metric tonne `t`; the legacy `MT` short name is not displayed as a unit symbol.
- Two measures are compatible only when the catalog has an explicit active positive compatibility relation. Shared family alone is not sufficient.
- `measure_compatibility` is normalized at the service boundary to target units per source unit. The displayed price per target unit is source-unit price divided by that factor. If only the reverse relation is active, invert the stored factor.

## ProductPrice

- Price is an amount per product and measure in USD, per the approved assumption.
- A price is eligible only when active and its effective date is not in the future at submission time.
- A direct eligible price for the selected measure wins. Otherwise, only an eligible base-measure price may be converted.
- No price or conversion means the line remains requestable with pending amounts.

## Precision and quote totals

1. Parse the canonical decimal-string quantity to thousandths only for continuous measures; discrete measures must be integral.
2. Parse PostgreSQL price and conversion-factor decimal strings into scaled integers. Keep conversion as a rational value, including when the stored relation must be inverted.
3. Multiply the unrounded rational converted price by the accepted quantity using `BigInt` arithmetic.
4. Round each line total half-up once to USD cents; sum line totals as integer cents.
5. Store the unit-rate snapshot rounded to six decimal places. Amounts remain decimal strings in API and email payloads; line and quote totals show two decimals.
6. If any line is unpriced, the quote total is pending and is not represented by a partial sum.

## Migration and historical data

- Update Prisma schema and application database schemas together.
- Convert integer quantity to scale-3 decimal without changing existing values.
- Widen quote total to `numeric(30,2)` and permit null; widen quote-item unit price to `numeric(24,6)` and line total to `numeric(30,2)`, permitting null for both.
- Preserve existing rows, including zero amounts. Their intent cannot be inferred safely from the number alone.
- `Quote.totalAmount` is already nullable; populate it only for fully priced new requests and associate the seeded/configured USD currency record.
- The repository has no checked-in Prisma migration history. Validate schema changes against a disposable/local database; do not claim a cPanel or production migration was performed by this feature plan.
