import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from '@playwright/test';

const en = JSON.parse(readFileSync('src/messages/en.json', 'utf8')) as Record<string, unknown>;
const es = JSON.parse(readFileSync('src/messages/es.json', 'utf8')) as Record<string, unknown>;

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap(name => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function flatten(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key)
  );
}

test('Spanish and English message keys match', () => {
  expect(flatten(en).sort()).toEqual(flatten(es).sort());
});

test('Spanish copy has no voseo forms', () => {
  const text = JSON.stringify(es);
  expect(text).not.toMatch(/Contanos|buscás|Recibí|tenés|podés|querés|mirá|fijate/i);
});

test('public source and translations have no emoji icons', () => {
  const files = [
    ...walk('src/app/[locale]'),
    ...walk('src/components/site'),
    ...walk('src/components/sections'),
    'src/components/Navigation.tsx',
    'src/components/Footer.tsx',
    'src/components/ThemeToggle.tsx',
    'src/components/LanguageSwitcher.tsx',
    'src/components/CookieConsent.tsx',
    'src/components/QuoteForm.tsx',
  ].filter(file => /\.(tsx?|jsx?)$/.test(file));
  const emoji = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

  for (const file of files) {
    expect(readFileSync(file, 'utf8'), file).not.toMatch(emoji);
  }

  expect(`${JSON.stringify(es)}${JSON.stringify(en)}`).not.toMatch(emoji);
});

test('English home uses translated content and declares its document language', async ({
  page,
}) => {
  await page.goto('/en');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Ecuadorian seafood, ready for export.'
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('default Spanish home stays on the canonical root route', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Productos del mar ecuatorianos, listos para exportar.'
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('language switcher updates the URL and document language', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel(/idioma/i).selectOption('en');
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('sitemap contains real product slugs and omits fictional slugs', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  const xml = await response.text();

  expect(response.ok()).toBeTruthy();
  expect(xml).toContain('/products/camaron-blanco-premium');
  expect(xml).not.toContain('/products/vannamei-shrimp');
  expect(xml).not.toContain('/categories/');
});

test('page metadata and structured business data use seafood-first content', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('ZIVAH International — Camarón, larvas y atún de Ecuador');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /assets\/images\/photos\/hero-marine\.jpg/
  );

  const localBusiness = await page.locator('#local-business-schema').textContent();
  expect(localBusiness).toBeTruthy();
  const schema = JSON.parse(localBusiness!);
  expect(schema.description).toContain('atún del Pacífico');
  expect(schema).not.toHaveProperty('aggregateRating');
});
