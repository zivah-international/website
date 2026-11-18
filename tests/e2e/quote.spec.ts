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

const quoteMeasures = [
  { id: 1, name: 'Kilogramo', shortName: 'kg', symbol: 'kg', type: 'WEIGHT', familyId: 1 },
  { id: 2, name: 'Tonelada métrica', shortName: 't', symbol: 't', type: 'WEIGHT', familyId: 1 },
  { id: 3, name: 'Pieza', shortName: 'pcs', symbol: 'pcs', type: 'QUANTITY', familyId: 2 },
  { id: 4, name: 'Libra', shortName: 'lb', symbol: 'lb', type: 'WEIGHT', familyId: 1 },
];

const pricedShrimp = {
  id: 100,
  name: 'Camarón de exportación',
  description: 'Camarón blanco congelado.',
  sku: 'SHRIMP-100',
  baseMeasureId: 1,
  prices: [
    { measureId: 1, price: '2.50', isActive: true, effectiveDate: '2026-01-01' },
    { measureId: 4, price: '9.00', isActive: true, effectiveDate: '2026-01-01' },
  ],
  compatibilities: [
    { fromMeasureId: 1, toMeasureId: 2, conversionFactor: '0.001000', isActive: true },
  ],
  eligibleMeasures: [quoteMeasures[0], quoteMeasures[1]],
};

async function addShrimp(
  page: import('@playwright/test').Page,
  searchLabel = 'Buscar y Seleccionar Productos'
) {
  await page.getByLabel(searchLabel).fill('camarón');
  await page.getByRole('button', { name: /Camarón de exportación/ }).click();
}

test('previews 1,5 metric tonnes from the current kilogram catalog rate', async ({ page }) => {
  await prepare(page);
  await mockQuoteApis(page, { products: [pricedShrimp], measures: quoteMeasures });
  await page.goto('/quote');
  await addShrimp(page);

  await page.getByLabel('Cantidad').fill('1,5');
  await page.getByLabel('Unidad de Medida').selectOption('2');

  await expect(page.locator('form .grid .flex.h-11').nth(0)).toContainText('2500,000000 USD');
  await expect(page.locator('form .grid .flex.h-11').nth(1)).toContainText('3750,00 USD');
  await expect(page.getByText(/Total Estimado/)).toContainText(/3750,00/);
  await expect(
    page.getByLabel('Unidad de Medida').locator('option', { hasText: 'lb' })
  ).toHaveCount(0);
});

test('previews 1.5 metric tonnes with English decimal and unit formatting', async ({ page }) => {
  await prepare(page);
  await mockQuoteApis(page, { products: [pricedShrimp], measures: quoteMeasures });
  await page.goto('/en/quote');
  await addShrimp(page, 'Search and Select Products');

  await page.getByLabel('Quantity').fill('1.5');
  await page.getByLabel('Unit of Measure').selectOption('2');

  await expect(page.getByLabel('Quantity')).toHaveValue('1.5');
  await expect(page.locator('form .grid .flex.h-11').nth(0)).toContainText(/USD\s*2,500\.000000/);
  await expect(page.locator('form .grid .flex.h-11').nth(1)).toContainText(/USD\s*3,750\.00/);
});

test('keeps unpriced requests available and labels the amount as pending', async ({ page }) => {
  await prepare(page);
  await mockQuoteApis(page, {
    products: [
      { ...pricedShrimp, prices: [], compatibilities: [], eligibleMeasures: [quoteMeasures[0]] },
    ],
    measures: quoteMeasures,
  });
  await page.goto('/quote');
  await addShrimp(page);

  await expect(page.getByText('Precio por confirmar').first()).toBeVisible();
  await expect(page.getByText('Pendiente de cotización').first()).toBeVisible();
});

test('rejects fractional counts and requires a destination country', async ({ page }) => {
  await prepare(page);
  await mockQuoteApis(page, {
    products: [
      {
        ...pricedShrimp,
        baseMeasureId: 3,
        prices: [{ measureId: 3, price: '1.00', isActive: true, effectiveDate: '2026-01-01' }],
        compatibilities: [],
        eligibleMeasures: [quoteMeasures[2]],
      },
    ],
    measures: quoteMeasures,
  });
  await page.goto('/quote');
  await addShrimp(page);
  await page.getByLabel('Cantidad').fill('1,5');
  await expect(page.getByText(/hasta 3 decimales|hasta 3 decimales/)).toBeVisible();

  await page.getByLabel('Cantidad').fill('2');
  await page.getByLabel('Nombre Completo').fill('Comprador de prueba');
  await page.locator('#customerEmail').fill('buyer@example.test');
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect(page.getByText('Debe seleccionar un país válido')).toBeVisible();
});

test('retries failed countries and rate-limited product searches only after user action', async ({
  page,
}) => {
  await prepare(page);
  await mockQuoteApis(page, {
    products: [pricedShrimp],
    measures: quoteMeasures,
    countryStatus: requestCount => (requestCount === 1 ? 503 : undefined),
    productSearchStatus: requestCount => (requestCount === 1 ? 429 : undefined),
  });
  await page.goto('/quote');

  await expect(
    page.getByText('Error cargando países. Por favor verifique su conexión e intente nuevamente.')
  ).toBeVisible();
  await page.getByRole('button', { name: 'Intentar de nuevo' }).first().click();
  await page.getByLabel('Buscar y Seleccionar Productos').fill('camarón');
  await expect(page.getByText(/límite de búsquedas/i)).toBeVisible();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Intentar de nuevo' }).last().click();
  await expect(page.getByRole('button', { name: /Camarón de exportación/ })).toBeVisible();
});

test('reports a saved request when the confirmation email fails and submits no client prices', async ({
  page,
}) => {
  await prepare(page);
  await mockQuoteApis(page, { products: [pricedShrimp], measures: quoteMeasures });
  let submitted: Record<string, unknown> | undefined;
  await page.route('**/api/quotes', async route => {
    submitted = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 201,
      json: { error: false, data: { emailSent: false } },
    });
  });
  await page.goto('/quote');
  await page.locator('#customerName').fill('Comprador de prueba');
  await page.locator('#customerEmail').fill('buyer@example.test');
  await page.getByLabel('País de Destino *').click();
  await page.getByText('Estados Unidos (USD)').click();
  await addShrimp(page);
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();

  await expect(
    page.getByText(/La solicitud fue registrada, pero no pudimos enviar el correo/)
  ).toBeVisible();
  expect(submitted).toBeDefined();
  const items = submitted?.items as Array<Record<string, unknown>>;
  expect(items[0]).not.toHaveProperty('unitPrice');
  expect(items[0]).not.toHaveProperty('totalPrice');
  expect(items[0].quantity).toBe('1');
});
