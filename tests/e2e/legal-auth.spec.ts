import { expect, test } from '@playwright/test';

import { prepare } from './fixtures';

const legalPages = [
  '/legal/privacy-policy',
  '/legal/terms-of-service',
  '/legal/cookie-policy',
  '/legal/data-protection',
];

for (const path of legalPages) {
  test(`${path} has a single heading, an update date, and working section links`, async ({
    page,
  }) => {
    await prepare(page);
    await page.goto(path);

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByText(/Última actualización/)).toBeVisible();
    const index = page.getByRole('navigation', { name: 'Índice de secciones' });
    const links = index.locator('a');
    expect(await links.count()).toBeGreaterThan(0);

    for (const link of await links.all()) {
      const target = await link.getAttribute('href');
      expect(target).toMatch(/^#[\w-]+$/);
      await expect(page.locator(target!)).toHaveCount(1);
    }
  });
}

test('English legal routes identify the Spanish legal document', async ({ page }) => {
  await prepare(page);
  await page.goto('/en/legal/privacy-policy');

  await expect(
    page.getByText(/This legal document is currently available in Spanish/)
  ).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Política de Privacidad');
});

test('sign-in uses public tokens and preserves one primary action', async ({ page }) => {
  await page.goto('/sign-in');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Acceso administrativo');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Iniciar sesión');
  await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toHaveCount(1);
  await expect(page.getByRole('img', { name: 'ZIVAH International' })).toBeVisible();
});

test('sign-up retains terms and privacy links', async ({ page }) => {
  await page.goto('/sign-up');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Acceso administrativo');
  await expect(page.getByRole('button', { name: 'Crear cuenta' })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Términos del servicio' })).toHaveAttribute(
    'href',
    '/legal/terms-of-service'
  );
  await expect(page.getByRole('link', { name: 'Política de privacidad' })).toHaveAttribute(
    'href',
    '/legal/privacy-policy'
  );
});
