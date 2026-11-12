import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { mockCatalog, mockQuoteApis, prepare } from './fixtures';

const pages = ['/', '/products', '/quote', '/contact'];

for (const path of pages) {
  test(`has no WCAG A/AA violations on ${path}`, async ({ page }) => {
    await prepare(page);
    if (path === '/products') await mockCatalog(page);
    if (path === '/quote') await mockQuoteApis(page);
    await page.goto(path);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(
      results.violations.map(({ id, impact, nodes }) => ({
        id,
        impact,
        targets: nodes.map(node => node.target),
      }))
    ).toEqual([]);
  });
}

test('public routes have exactly one h1', async ({ page }) => {
  await prepare(page);

  for (const path of pages) {
    if (path === '/products') await mockCatalog(page);
    if (path === '/quote') await mockQuoteApis(page);
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  }
});

test('dark home has no WCAG A/AA violations', async ({ page }) => {
  await prepare(page);
  await page.goto('/');
  await page.evaluate(() => document.documentElement.classList.add('dark'));

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(
    results.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map(node => node.target),
    }))
  ).toEqual([]);
});
