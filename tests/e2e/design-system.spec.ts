import { expect, test } from '@playwright/test';

test('uses the approved paper, navy, accent, and 2px radius tokens', async ({ page }) => {
  await page.goto('/');

  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    // Custom-property values are returned verbatim, and Prettier normalizes hex
    // literals to lowercase, so compare colors case-insensitively.
    return {
      background: styles.getPropertyValue('--background').trim().toLowerCase(),
      foreground: styles.getPropertyValue('--foreground').trim().toLowerCase(),
      accent: styles.getPropertyValue('--accent').trim().toLowerCase(),
      radius: styles.getPropertyValue('--radius').trim(),
    };
  });

  const { radius, ...colors } = tokens;

  expect(colors).toEqual({
    background: '#f6f4ef',
    foreground: '#14202b',
    accent: '#c0451f',
  });
  // Prettier rewrites `0.125rem` as `.125rem`, so accept both spellings of 2px.
  expect(radius).toMatch(/^0?\.125rem$/);
});

test('uses Newsreader for public display headings and Inter for body', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1').first()).toHaveCSS('font-family', /Newsreader/i);
  await expect(page.locator('p').first()).toHaveCSS('font-family', /Inter|__Inter/i);
});

test('dark mode swaps the public surface tokens', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.documentElement.classList.add('dark'));

  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--background')
          .trim()
          .toLowerCase()
      )
    )
    .toBe('#0a1622');
});
