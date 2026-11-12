import { expect, test } from '@playwright/test';

import { prepare } from './fixtures';

test('quality page leads with four marine certifications and one CTA', async ({ page }) => {
  await prepare(page);
  await page.goto('/quality');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Certificaciones que abren mercados.'
  );
  for (const code of ['BAP', 'HACCP', 'BRC', 'MSC']) {
    await expect(page.getByTestId('certification-row').filter({ hasText: code })).toHaveCount(1);
  }
  await expect(page.getByText('Líneas agrícolas: GlobalGAP.')).toBeVisible();
  await expect(page.getByTestId('quality-step')).toHaveCount(4);
  await expect(
    page.locator('main').getByRole('link', { name: 'Solicitar cotización' })
  ).toHaveCount(1);
});

test('quality page has no emoji or tinted certification cards', async ({ page }) => {
  await prepare(page);
  await page.goto('/quality');

  await expect(page.getByText(/🦐|🔬|🏷️|🌱|🏆|⭐/u)).toHaveCount(0);

  const backgrounds = await page
    .getByTestId('certification-row')
    .evaluateAll(nodes => nodes.map(node => getComputedStyle(node).backgroundColor));
  expect(new Set(backgrounds).size).toBe(1);
});
