import { expect, test } from '@playwright/test';

import { prepare } from './fixtures';

test('product detail leads with a local image, specs, and one product quote CTA', async ({
  page,
}) => {
  await prepare(page);
  await page.goto('/products/camaron-blanco-premium');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Camarón Blanco Premium');
  await expect(page.getByTestId('product-hero-image')).toHaveAttribute(
    'src',
    /camaron-blanco-premium\.jpg/
  );
  await expect(page.getByTestId('product-specs')).toContainText('Guayas, Ecuador');
  await expect(
    page.getByRole('link', { name: 'Solicitar cotización para este producto' })
  ).toHaveAttribute('href', '/quote?product=camaron-blanco-premium');
  await expect(page.getByRole('link', { name: 'Descargar ficha técnica' })).toHaveAttribute(
    'href',
    '/products/camaron-blanco-premium/ficha-tecnica'
  );
});

test('related products are capped at three and exclude the current product', async ({ page }) => {
  await prepare(page);
  await page.goto('/products/camaron-blanco-premium');

  const related = page.getByTestId('related-product');
  await expect(related).toHaveCount(2);
  await expect(related.first()).not.toContainText('Camarón Blanco Premium');
});

test('technical sheet is print-friendly and has a screen-only print button', async ({ page }) => {
  await prepare(page);
  await page.goto('/products/camaron-blanco-premium/ficha-tecnica');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ficha Técnica');
  await expect(page.getByRole('button', { name: /imprimir/i })).toBeVisible();
  await expect(page.locator('.no-print').first()).toBeVisible();
  await expect(page.getByText('🇪🇨')).toHaveCount(0);
});
