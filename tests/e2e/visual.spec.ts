import { expect, test } from '@playwright/test';

import { mockCatalog, mockQuoteApis, prepare } from './fixtures';

test('capture public pages in desktop and mobile themes', async ({ page }) => {
  await prepare(page);

  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
    await page.goto('/');
    await page.screenshot({
      path: `test-results/screenshots/home-light-${width}.png`,
      fullPage: true,
    });
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(350);
    await page.screenshot({
      path: `test-results/screenshots/home-dark-${width}.png`,
      fullPage: true,
    });
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
  }

  await mockCatalog(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/products');
  const firstProductImage = page.getByTestId('product-card').first().locator('img');
  await expect(firstProductImage).toBeVisible();
  await expect
    .poll(() => firstProductImage.evaluate(image => (image as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  await page.screenshot({ path: 'test-results/screenshots/products-1440.png', fullPage: true });

  await mockQuoteApis(page);
  await page.goto('/quote');
  await expect(page.getByRole('button', { name: 'Enviar solicitud' })).toBeVisible();
  await page.screenshot({ path: 'test-results/screenshots/quote-1440.png', fullPage: true });
});
