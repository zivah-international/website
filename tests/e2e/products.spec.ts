import { expect, test } from '@playwright/test';

import { CATEGORIES, mockCatalog, prepare } from './fixtures';

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
