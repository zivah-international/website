import { expect, test } from '@playwright/test';

import { prepare } from './fixtures';

test('contact page shows both offices, direct links, and one form', async ({ page }) => {
  await prepare(page);
  await page.goto('/contact');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Hablemos de tu próxima compra.'
  );
  const main = page.locator('main');
  await expect(main.getByText('Samborondón, Guayas')).toBeVisible();
  await expect(main.getByText('Miami, Florida')).toBeVisible();
  await expect(main.getByRole('link', { name: /sales@zivahinternational\.com/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /\+593 99 900 2893/ })).toBeVisible();
  await expect(main.getByRole('link', { name: /WhatsApp/i })).toHaveCount(1);
  await expect(main.getByRole('button', { name: /enviar mensaje/i })).toHaveCount(1);
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('contact page has no emoji icons or voseo', async ({ page }) => {
  await prepare(page);
  await page.goto('/contact');

  await expect(page.getByText(/📍|🇪🇨|🇺🇸|🕒|📞|✉️/u)).toHaveCount(0);
  await expect(page.getByText(/Contanos|buscás|Recibí|tenés|podés|querés/i)).toHaveCount(0);
});
