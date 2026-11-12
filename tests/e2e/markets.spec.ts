import { expect, test } from '@playwright/test';

import { prepare } from './fixtures';

test('markets page shows six markets, four active, and a text-alternative map', async ({
  page,
}) => {
  await prepare(page);
  await page.goto('/markets');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Desde Guayas y Miami al mundo.'
  );
  await expect(page.getByTestId('market-row')).toHaveCount(6);
  await expect(page.getByTestId('market-row').filter({ hasText: 'Activo' })).toHaveCount(4);
  await expect(page.getByRole('img', { name: /mapa de mercados/i })).toBeVisible();
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('markets page uses country codes, not flag emoji', async ({ page }) => {
  await prepare(page);
  await page.goto('/markets');

  await expect(page.getByText('US', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/🇺🇸|🇯🇵|🇳🇱|🇨🇳|🇨🇦|🇦🇪/u)).toHaveCount(0);
});
