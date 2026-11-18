# Quote API Contract

The existing Next.js Route Handlers remain the public contract. All responses keep the current wrapper shape:

```json
{
  "error": false,
  "data": {},
  "message": "...",
  "timestamp": "ISO-8601"
}
```

## `GET /api/quotes/measures`

Return active measures in a stable camelCase shape:

```json
{
  "id": 1,
  "name": "Kilogram",
  "shortName": "kg",
  "symbol": "kg",
  "type": "WEIGHT",
  "familyId": 1,
  "baseUnit": "kg",
  "conversionFactor": "1.000000"
}
```

The symbol is the display symbol. Mass values display `kg` or `t`, with a number-space-symbol format; the legacy `MT` abbreviation is not displayed as the tonne symbol.

## `GET /api/quotes/products/search`

Return active products with canonical base-measure metadata, only active prices whose effective date has arrived, and eligible measures/conversion factors needed to show a preview. Do not choose an arbitrary active price as a base price. The response must distinguish a direct price from a derived estimate and must support an unpriced product without substituting zero.

The form may show catalog estimates from this response, but the response is not trusted as the final amount when the quote is submitted.

## `POST /api/quotes`

### Request

```json
{
  "customerName": "Comprador de prueba",
  "customerEmail": "buyer@example.test",
  "customerPhone": "+593 99 000 0000",
  "company": "Empresa de prueba",
  "countryId": 1,
  "locale": "es",
  "recipientEmail": "buyer@example.test",
  "message": "Consulta de disponibilidad",
  "items": [
    {
      "productId": 10,
      "measureId": 2,
      "quantity": "1.5",
      "notes": "Empaque solicitado",
      "specifications": { "packaging": "caja" }
    }
  ]
}
```

`countryId` is required. `locale` is `es` or `en`. Quantity is a canonical decimal string, must match the selected measure category, and must be positive with no more than three decimal places for continuous measures. Count/package/container quantities are positive integers. The request does not define a unit price or line total. If legacy or manipulated price fields are submitted, the server ignores them and recalculates from the catalog.

### Server validation and calculation

- Revalidate product, selected measure, compatibility, quantity precision, current price, and effective date at submission time.
- Use a direct price for the requested measure when present; otherwise use only the base-unit price and an active explicit conversion.
- Store missing line amounts as absent and keep the quote total absent if any item has no eligible price. Decimal amounts remain strings at API boundaries.
- Calculate line amounts from full-precision converted unit price and quantity; round line totals and quote total to USD cents.
- Save the request even if email delivery fails; return the actual `emailSent` outcome.

### Success response

HTTP `201`; `data` includes quote reference, validated items and canonical decimal-string quantities, nullable unit/line amount strings, nullable total estimate string, USD currency when present, and `emailSent: boolean`. For example, converted unit price `"1000.000000"`, line total `"1500.00"`, and total `"1500.00"`. `error` remains `false` when the request is stored but email delivery fails; localized UI copy must distinguish those outcomes.

### Error responses

- `400`: invalid contact, missing destination, unsupported measure, incompatible conversion, or invalid quantity.
- `429`: rate limit; include `Retry-After` and show a user-triggered retry path.
- `500`: storage or request-processing failure. Email failure alone does not turn a stored request into an API failure.

## Email payload contract

The server passes a localized receipt payload containing the quote reference, contact and country, locale, each product's canonical quantity string and unit symbol, notes/specifications, nullable decimal-string estimated unit/line amounts, and a quote total only when every line is priced. It must preserve the current business BCC. Both `text` and `html` representations carry the same data and disclaimer.
