import type { Page } from '@playwright/test';

export const CATEGORIES = [
  { id: 1, name: 'Productos del Mar', slug: 'marinos-y-pesca', isActive: true },
  { id: 2, name: 'Agrícolas', slug: 'agricolas', isActive: true },
  { id: 3, name: 'Otros productos', slug: 'otros-productos', isActive: true },
];

export const PRODUCTS = [
  {
    id: 10,
    name: 'Banano Cavendish Premium',
    slug: 'banano-cavendish-premium',
    shortDescription: 'Banano de exportación.',
    origin: 'Ecuador',
    certifications: ['GlobalGAP'],
    isFeatured: false,
    isActive: true,
    category: CATEGORIES[1],
  },
  {
    id: 11,
    name: 'Camarón Blanco Premium',
    slug: 'camaron-blanco-premium',
    shortDescription: 'Camarón vannamei IQF.',
    origin: 'Guayas, Ecuador',
    certifications: ['BAP', 'HACCP'],
    isFeatured: true,
    isActive: true,
    category: CATEGORIES[0],
  },
  {
    id: 12,
    name: 'Larvas de camarón Post-Larva',
    slug: 'larvas-camaron-postlarva',
    shortDescription: 'Post-larvas PL10–PL15.',
    origin: 'Guayas, Ecuador',
    certifications: ['BAP'],
    isFeatured: false,
    isActive: true,
    category: CATEGORIES[0],
  },
  {
    id: 13,
    name: 'Atún Fresco del Pacífico',
    slug: 'atun-fresco-pacifico',
    shortDescription: 'Lomos y steak de atún.',
    origin: 'Manta, Ecuador',
    certifications: ['HACCP', 'MSC'],
    isFeatured: true,
    isActive: true,
    category: CATEGORIES[0],
  },
];

export async function prepare(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  });
}

export async function mockCatalog(page: Page) {
  await page.route('**/api/categories*', route => route.fulfill({ json: { data: CATEGORIES } }));
  await page.route('**/api/products*', route => route.fulfill({ json: { data: PRODUCTS } }));
}

export interface MockQuoteApiOptions {
  products?: Array<Record<string, unknown>>;
  measures?: Array<Record<string, unknown>>;
  countries?: Array<Record<string, unknown>>;
  countryStatus?: (requestCount: number) => number | undefined;
  productSearchStatus?: (requestCount: number) => number | undefined;
}

export async function mockQuoteApis(page: Page, options: MockQuoteApiOptions = {}) {
  let countryRequests = 0;
  let productSearchRequests = 0;
  await page.route('**/api/quotes/countries', route => {
    countryRequests += 1;
    const status = options.countryStatus?.(countryRequests);
    if (status) return route.fulfill({ status, json: { error: true, data: null } });
    return route.fulfill({
      json: {
        error: false,
        data: options.countries || [{ id: 1, name: 'Estados Unidos', code: 'US', currency: 'USD' }],
      },
    });
  });
  await page.route('**/api/quotes/measures', route =>
    route.fulfill({
      json: {
        error: false,
        data: options.measures || [
          { id: 1, name: 'Kilogramo', shortName: 'kg', symbol: 'kg', type: 'WEIGHT', familyId: 1 },
        ],
      },
    })
  );
  await page.route('**/api/quotes/products/search*', route => {
    productSearchRequests += 1;
    const status = options.productSearchStatus?.(productSearchRequests);
    if (status) return route.fulfill({ status, json: { error: true, data: null } });
    return route.fulfill({ json: { error: false, data: options.products || [] } });
  });
}
