import { expect, test } from '@playwright/test';
import { Pool } from 'pg';

import {
  calculateLineTotal,
  isValidCanonicalQuantity,
  resolveUnitPrice,
} from '../../src/lib/quote-pricing';
import { quoteFormSchema } from '../../src/lib/validation';

const validRequest = {
  customerName: 'Buyer Example',
  customerEmail: 'buyer@example.test',
  countryId: 1,
  locale: 'en' as const,
  recipientEmail: 'buyer@example.test',
  items: [{ productId: 10, measureId: 2, quantity: '1.5' }],
};

test('server request contract ignores submitted prices and preserves locale and decimal quantities', () => {
  const parsed = quoteFormSchema.safeParse({
    ...validRequest,
    items: [{ ...validRequest.items[0], unitPrice: 0.01, totalPrice: 0.02 }],
  });

  expect(parsed.success).toBe(true);
  if (!parsed.success) return;
  expect(parsed.data.locale).toBe('en');
  expect(parsed.data.items[0].quantity).toBe('1.5');
  expect(parsed.data.items[0]).not.toHaveProperty('unitPrice');
  expect(parsed.data.items[0]).not.toHaveProperty('totalPrice');
});

test('server contract requires destination and canonical decimal-string quantities', () => {
  expect(quoteFormSchema.safeParse({ ...validRequest, countryId: undefined }).success).toBe(false);
  expect(
    quoteFormSchema.safeParse({
      ...validRequest,
      items: [{ productId: 10, measureId: 2, quantity: 1.5 }],
    }).success
  ).toBe(false);
  expect(isValidCanonicalQuantity('1.500', 'WEIGHT')).toBe(true);
  expect(isValidCanonicalQuantity('1.5', 'QUANTITY')).toBe(false);
  expect(isValidCanonicalQuantity('10000.001', 'WEIGHT')).toBe(false);
});

test('server estimate uses direct current price and explicit conversion with exact line rounding', () => {
  const price = resolveUnitPrice({
    prices: [
      { measureId: 1, price: '2.50', isActive: true, effectiveDate: '2026-01-01' },
      { measureId: 2, price: '9000.00', isActive: false, effectiveDate: '2026-01-01' },
    ],
    baseMeasureId: 1,
    selectedMeasureId: 2,
    compatibilities: [
      {
        fromMeasureId: 1,
        toMeasureId: 2,
        conversionFactor: '0.001000',
        isActive: true,
      },
    ],
    now: new Date('2026-11-16T12:00:00Z'),
  });

  expect(price?.displayAmount).toBe('2500.000000');
  expect(price && calculateLineTotal('1.5', price.rational)).toBe('3750.00');
});

test('server request remains valid with a compatible but unpriced item and keeps amounts absent', () => {
  expect(quoteFormSchema.safeParse(validRequest).success).toBe(true);
  const price = resolveUnitPrice({
    prices: [],
    baseMeasureId: 1,
    selectedMeasureId: 2,
    compatibilities: [
      {
        fromMeasureId: 1,
        toMeasureId: 2,
        conversionFactor: '0.001000',
        isActive: true,
      },
    ],
  });

  expect(price).toBeNull();
  expect(price ? calculateLineTotal('1.5', price.rational) : null).toBeNull();
  expect(
    resolveUnitPrice({
      prices: [],
      baseMeasureId: 1,
      selectedMeasureId: 4,
      compatibilities: [],
    })
  ).toBeNull();
});

const quoteTestDatabaseUrl = process.env.QUOTE_TEST_DATABASE_URL;
const isLocalQuoteTestDatabase = (() => {
  if (!quoteTestDatabaseUrl) return false;
  try {
    const url = new URL(quoteTestDatabaseUrl);
    return (
      url.hostname === '127.0.0.1' && url.port === '55432' && url.pathname === '/zivah_quotes_test'
    );
  } catch {
    return false;
  }
})();

test.describe('POST /api/quotes against the disposable local PostgreSQL fixture', () => {
  test.skip(
    !isLocalQuoteTestDatabase,
    'Requires QUOTE_TEST_DATABASE_URL pointing to the isolated 127.0.0.1:55432/zivah_quotes_test database.'
  );

  let database: Pool;
  let countryId: number;
  let kgId: number;
  let tonneId: number;
  let poundId: number;
  let pieceId: number;
  let pricedProductId: number;
  let unpricedProductId: number;
  let discreteProductId: number;

  test.beforeAll(async () => {
    database = new Pool({ connectionString: quoteTestDatabaseUrl });

    const currency = await database.query<{ id: number }>(
      `INSERT INTO currencies (code, name, symbol, is_active)
       VALUES ('USD', 'US Dollar', '$', true)
       ON CONFLICT (code) DO UPDATE SET is_active = true
       RETURNING id`
    );
    const family = await database.query<{ id: number }>(
      `INSERT INTO measure_families (name, code, is_active, sort_order)
       VALUES ('Quote Test Measures', 'QTEST', true, 0)
       ON CONFLICT (code) DO UPDATE SET is_active = true
       RETURNING id`
    );
    const insertMeasure = async (name: string, shortName: string, type: string) => {
      const result = await database.query<{ id: number }>(
        `INSERT INTO measures (name, short_name, symbol, type, family_id, is_active, base_unit)
         VALUES ($1, $2, $2, $3, $4, true, $2)
         ON CONFLICT (name) DO UPDATE SET is_active = true, family_id = EXCLUDED.family_id
         RETURNING id`,
        [name, shortName, type, family.rows[0].id]
      );
      return result.rows[0].id;
    };
    kgId = await insertMeasure('Quote Test Kilogram', 'kg', 'WEIGHT');
    tonneId = await insertMeasure('Quote Test Tonne', 't', 'WEIGHT');
    poundId = await insertMeasure('Quote Test Pound', 'lb', 'WEIGHT');
    pieceId = await insertMeasure('Quote Test Piece', 'pcs', 'QUANTITY');

    const country = await database.query<{ id: number }>(
      `INSERT INTO countries (name, code, continent, currency_id, is_active)
       VALUES ('Quote Test Country', 'QT', 'Test', $1, true)
       ON CONFLICT (code) DO UPDATE SET is_active = true, currency_id = EXCLUDED.currency_id
       RETURNING id`,
      [currency.rows[0].id]
    );
    countryId = country.rows[0].id;

    const insertProduct = async (slug: string, name: string, measureId: number) => {
      const result = await database.query<{ id: number }>(
        `INSERT INTO products (name, slug, measure_id, is_active, origin)
         VALUES ($1, $2, $3, true, 'Ecuador')
         ON CONFLICT (slug) DO UPDATE SET is_active = true, measure_id = EXCLUDED.measure_id
         RETURNING id`,
        [name, slug, measureId]
      );
      return result.rows[0].id;
    };
    pricedProductId = await insertProduct(
      'quote-test-priced-shrimp',
      'Quote Test Priced Shrimp',
      kgId
    );
    unpricedProductId = await insertProduct(
      'quote-test-unpriced-shrimp',
      'Quote Test Unpriced Shrimp',
      kgId
    );
    discreteProductId = await insertProduct('quote-test-pieces', 'Quote Test Pieces', pieceId);

    await database.query(
      `INSERT INTO product_prices (product_id, measure_id, price, is_active, effective_date)
       VALUES ($1, $2, '2.50', true, NOW() - INTERVAL '1 day')
       ON CONFLICT (product_id, measure_id) DO UPDATE
         SET price = EXCLUDED.price, is_active = true, effective_date = EXCLUDED.effective_date`,
      [pricedProductId, kgId]
    );
    await database.query(
      `INSERT INTO product_prices (product_id, measure_id, price, is_active, effective_date)
       VALUES ($1, $2, '9.00', true, NOW() - INTERVAL '1 day')
       ON CONFLICT (product_id, measure_id) DO UPDATE
         SET price = EXCLUDED.price, is_active = true, effective_date = EXCLUDED.effective_date`,
      [pricedProductId, poundId]
    );
    await database.query(
      `INSERT INTO product_prices (product_id, measure_id, price, is_active, effective_date)
       VALUES ($1, $2, '1.00', true, NOW() - INTERVAL '1 day')
       ON CONFLICT (product_id, measure_id) DO UPDATE
         SET price = EXCLUDED.price, is_active = true, effective_date = EXCLUDED.effective_date`,
      [discreteProductId, pieceId]
    );
    await database.query(
      `INSERT INTO measure_compatibility (from_measure_id, to_measure_id, conversion_factor, is_active)
       VALUES ($1, $2, '0.001000', true)
       ON CONFLICT (from_measure_id, to_measure_id) DO UPDATE
         SET conversion_factor = EXCLUDED.conversion_factor, is_active = true`,
      [kgId, tonneId]
    );
  });

  test.afterAll(async () => {
    await database?.end();
  });

  test('ignores client prices, persists exact converted amounts and keeps unpriced requests pending', async ({
    request,
  }) => {
    let requestNumber = 1;
    const postQuote = (data: Record<string, unknown>) =>
      request.post('/api/quotes', {
        headers: { 'x-forwarded-for': `198.51.100.${requestNumber++}` },
        data,
      });

    const pricedResponse = await postQuote({
      customerName: 'Test Buyer',
      customerEmail: 'buyer@example.test',
      countryId,
      locale: 'en',
      recipientEmail: 'buyer@example.test',
      items: [
        {
          productId: pricedProductId,
          measureId: tonneId,
          quantity: '1.5',
          unitPrice: 0.01,
          totalPrice: 0.02,
        },
      ],
    });
    expect(pricedResponse.status()).toBe(201);
    const pricedBody = await pricedResponse.json();
    expect(pricedBody.data.items[0].quantity).toBe('1.5');
    expect(pricedBody.data.items[0].unitPrice).toBe('2500.000000');
    expect(pricedBody.data.items[0].totalPrice).toBe('3750.00');
    expect(pricedBody.data.totalAmount).toBe('3750.00');
    expect(pricedBody.data.emailSent).toBe(false);

    const persistedPriced = await database.query<{
      quantity: string;
      unit_price: string;
      total_price: string;
    }>(
      `SELECT qi.quantity::text AS quantity, qi.unit_price::text AS unit_price,
              qi.total_price::text AS total_price
       FROM quote_items qi WHERE qi.quote_id = $1`,
      [pricedBody.data.id]
    );
    expect(persistedPriced.rows[0]).toEqual({
      quantity: '1.500',
      unit_price: '2500.000000',
      total_price: '3750.00',
    });

    const unpricedResponse = await postQuote({
      customerName: 'Test Buyer',
      customerEmail: 'buyer@example.test',
      countryId,
      items: [{ productId: unpricedProductId, measureId: kgId, quantity: '1' }],
    });
    expect(unpricedResponse.status()).toBe(201);
    const unpricedBody = await unpricedResponse.json();
    expect(unpricedBody.data.items[0].unitPrice).toBeNull();
    expect(unpricedBody.data.items[0].totalPrice).toBeNull();
    expect(unpricedBody.data.totalAmount).toBeNull();

    const persistedUnpriced = await database.query<{
      unit_price: string | null;
      total_price: string | null;
      total_amount: string | null;
    }>(
      `SELECT qi.unit_price::text AS unit_price, qi.total_price::text AS total_price,
              q.total_amount::text AS total_amount
       FROM quote_items qi JOIN quotes q ON q.id = qi.quote_id WHERE q.id = $1`,
      [unpricedBody.data.id]
    );
    expect(persistedUnpriced.rows[0]).toEqual({
      unit_price: null,
      total_price: null,
      total_amount: null,
    });

    const incompatibleResponse = await postQuote({
      customerName: 'Test Buyer',
      customerEmail: 'buyer@example.test',
      countryId,
      items: [{ productId: pricedProductId, measureId: poundId, quantity: '1' }],
    });
    expect(incompatibleResponse.status()).toBe(400);

    const fractionalDiscreteResponse = await postQuote({
      customerName: 'Test Buyer',
      customerEmail: 'buyer@example.test',
      countryId,
      items: [{ productId: discreteProductId, measureId: pieceId, quantity: '1.5' }],
    });
    expect(fractionalDiscreteResponse.status()).toBe(400);

    const missingCountryResponse = await postQuote({
      customerName: 'Test Buyer',
      customerEmail: 'buyer@example.test',
      items: [{ productId: pricedProductId, measureId: kgId, quantity: '1' }],
    });
    expect(missingCountryResponse.status()).toBe(400);
  });
});
