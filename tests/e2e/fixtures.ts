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
