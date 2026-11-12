import { expect, test } from '@playwright/test';

import { mockCatalog, mockQuoteApis, prepare } from './fixtures';

for (const path of ['/', '/products', '/quote', '/contact']) {
  for (const width of [375, 768, 1024, 1440]) {
    test(`no horizontal overflow on ${path} at ${width}px`, async ({ page }) => {
      await prepare(page);
      if (path === '/products') await mockCatalog(page);
      if (path === '/quote') await mockQuoteApis(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
}

test('mobile home quote action meets touch size and width expectations', async ({ page }) => {
  await prepare(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const cta = page.getByRole('link', { name: 'Solicitar cotización FOB' });
  const box = await cta.boundingBox();
  expect(box?.width).toBeGreaterThan(300);
  expect(box?.height).toBeGreaterThanOrEqual(44);
});

test('mobile drawer opens and closes with Escape', async ({ page }) => {
  await prepare(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  await page.getByRole('button', { name: /abrir menú/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
