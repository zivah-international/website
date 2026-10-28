import { expect, test, type Page } from '@playwright/test';

async function prepare(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  });
}

test('hero leads with seafood and one FOB quote action', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Productos del mar ecuatorianos, listos para exportar.'
  );
  await expect(page.getByRole('link', { name: 'Solicitar cotización FOB' })).toHaveAttribute(
    'href',
    '/quote'
  );
  await expect(page.getByRole('link', { name: 'Ver productos del mar' })).toHaveAttribute(
    'href',
    '#productos-del-mar'
  );
  await expect(page.locator('[aria-label*="anterior" i], [aria-label*="siguiente" i]')).toHaveCount(
    0
  );
});

test('evidence bar uses the shared metrics', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const evidence = page.getByTestId('evidence-bar');
  await expect(evidence).toContainText('6 mercados');
  await expect(evidence).toContainText('4 activos');
  await expect(evidence).toContainText('24 h');
  await expect(evidence).toContainText('4 certificaciones');
  await expect(evidence).toContainText('100%');
});

test('three seafood plates appear before the agricultural strip', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const cards = page.getByTestId('seafood-card');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText('Camarón Blanco Premium');
  await expect(cards.nth(1)).toContainText('Larvas de camarón Post-Larva');
  await expect(cards.nth(2)).toContainText('Atún Fresco del Pacífico');
  await expect(page.getByTestId('secondary-lines')).toContainText(
    'También exportamos frutas tropicales'
  );
  await expect(page.locator('section#productos-del-mar')).toHaveCount(1);
});

test('hero uses a local image and no remote hosts', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const hero = page.getByTestId('hero');
  const image = hero.locator('img');
  await expect(image).toHaveAttribute('src', /hero-marine\.jpg/);
});
