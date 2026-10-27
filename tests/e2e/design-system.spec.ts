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

  // The Tailwind radius scale must resolve to the same token; otherwise
  // `rounded-md` (buttons, inputs) stays 6px while brand buttons are 2px.
  const utilityRadius = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.className = 'rounded-md';
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    document.body.appendChild(probe);
    const { borderRadius } = getComputedStyle(probe);
    probe.remove();
    return borderRadius;
  });

  expect(utilityRadius).toBe('2px');
});

test('uses Newsreader for public display headings and Inter for body', async ({ page }) => {
  await page.goto('/');

  // next/font emits the family plus a metric-matched `"Inter Fallback"`
  // companion (Next 16 keeps the unhashed name), so matching the companion
  // proves the variable resolved instead of a locally installed Inter.
  await expect(page.locator('.public-site h1').first()).toHaveCSS(
    'font-family',
    /Newsreader Fallback/
  );
  await expect(page.locator('.public-site p').first()).toHaveCSS('font-family', /Inter Fallback/);
  // Radix portals (sheet, dropdown, dialogs, toasts) mount on <body>, outside
  // `.public-site`, so the font variables must also be defined on the body.
  await expect(page.locator('body')).toHaveCSS('font-family', /Inter Fallback/);

  // h5/h6 are public display headings too, but no public page renders one yet,
  // so probe the rule with a throwaway element inside the public wrapper.
  const smallHeadingFamily = await page.evaluate(() => {
    const wrapper = document.querySelector('.public-site');
    const probe = document.createElement('h6');
    wrapper?.appendChild(probe);
    const { fontFamily } = getComputedStyle(probe);
    probe.remove();
    return fontFamily;
  });

  expect(smallHeadingFamily).toMatch(/Newsreader Fallback/);
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
