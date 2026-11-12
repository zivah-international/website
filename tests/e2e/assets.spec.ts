import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from '@playwright/test';

import { getProductImage, PRODUCT_SLUGS } from '../../src/lib/product-images';
import { mockCatalog, prepare } from './fixtures';

const productImages = readFileSync('src/lib/product-images.ts', 'utf8');
const config = readFileSync('next.config.ts', 'utf8');
const remoteImageHost = /images\.unsplash\.com|images\.pexels\.com|plus\.unsplash\.com/;

test('public image source map and Next config use no remote stock-photo hosts', () => {
  expect(productImages).not.toMatch(remoteImageHost);
  expect(config).not.toMatch(remoteImageHost);
  expect(config).toMatch(/remotePatterns:\s*\[\]/);
});

test('every curated product slug resolves to an existing local image', () => {
  expect(PRODUCT_SLUGS.length).toBeGreaterThan(0);
  for (const slug of PRODUCT_SLUGS) {
    const publicPath = getProductImage(slug);
    expect(publicPath).toMatch(/^\/assets\/images\/products\/[\w-]+\.jpg$/);
    expect(existsSync(join('public', publicPath))).toBeTruthy();
  }
});

test('catalog ignores a broken remote image URL returned by the API', async ({ page }) => {
  await prepare(page);
  await mockCatalog(page);
  await page.goto('/products');

  const image = page.getByTestId('product-card').first().locator('img');
  const src = await image.getAttribute('src');
  expect(decodeURIComponent(src ?? '')).toContain(
    '/assets/images/products/camaron-blanco-premium.jpg'
  );
});

test('home loads only local images', async ({ page }) => {
  await prepare(page);
  await page.goto('/');

  const sources = await page
    .locator('img')
    .evaluateAll(nodes => nodes.map(node => (node as HTMLImageElement).getAttribute('src') ?? ''));
  expect(sources.length).toBeGreaterThan(0);
  expect(sources.every(src => src.startsWith('/'))).toBe(true);
});
