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
