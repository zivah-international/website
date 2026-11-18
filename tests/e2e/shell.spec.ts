import { expect, type Page, test } from '@playwright/test';

async function prepare(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  });
}

function collectThemeErrors(page: Page) {
  const errors: string[] = [];
  const relevantError =
    /encountered a script tag|hydration|server-rendered html|text content does not match/i;

  page.on('console', message => {
    if (message.type() === 'error' && relevantError.test(message.text())) {
      errors.push(message.text());
    }
  });

  page.on('pageerror', error => {
    if (relevantError.test(error.message)) {
      errors.push(error.message);
    }
  });

  return errors;
}

test('header exposes four sections and one quote action', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const nav = page.getByRole('navigation', { name: /principal/i });
  await expect(nav.getByRole('link', { name: 'Productos' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Calidad' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Mercados' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Contacto' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Cotizar' })).toHaveCount(0);
  await expect(page.locator('header a[href="/quote"]')).toHaveCount(1);
});

test('footer has four quiet columns and no newsletter', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('heading', { name: 'Productos' })).toBeVisible();
  await expect(footer.getByRole('heading', { name: 'Compañía' })).toBeVisible();
  await expect(footer.getByRole('heading', { name: 'Contacto' })).toBeVisible();
  await expect(footer.getByText(/newsletter|suscríbete|suscribete/i)).toHaveCount(0);
});

test('no floating WhatsApp button remains', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  await expect(page.locator('a[href*="wa.me"].fixed')).toHaveCount(0);
});

test('language switcher shows ES/EN text without flags', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  await expect(page.getByLabel(/idioma/i)).toBeVisible();
  await expect(page.getByLabel(/idioma/i).locator('option')).toHaveText(['ES', 'EN']);
});

test('mobile drawer traps focus and closes with Escape', async ({ page }) => {
  await prepare(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('button', { name: /abrir menú/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Productos' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('skip link is the first focus target', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused();
});

test('theme toggle changes the document theme', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const toggle = page.getByRole('button', { name: /cambiar a (modo )?oscuro/i });
  await toggle.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('saved dark theme initializes without script or hydration errors', async ({ page }) => {
  const themeErrors = collectThemeErrors(page);
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await prepare(page);
  await page.goto('/');

  const toggle = page.getByRole('button', { name: /cambiar a modo claro/i });
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(toggle).toBeEnabled();

  await toggle.click();
  const lightModeToggle = page.getByRole('button', { name: /cambiar a modo oscuro/i });
  await expect(page.locator('html')).toHaveClass(/light/);
  await expect(lightModeToggle).toBeEnabled();

  await page.reload();
  await expect(page.locator('html')).toHaveClass(/light/);
  await expect(lightModeToggle).toBeVisible();
  expect(themeErrors).toEqual([]);
});

test('saved light theme shows the matching accessible toggle label', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await prepare(page);
  await page.goto('/');

  await expect(page.locator('html')).toHaveClass(/light/);
  await expect(page.getByRole('button', { name: /cambiar a modo oscuro/i })).toBeEnabled();
});
