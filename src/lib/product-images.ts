/**
 * Curated Unsplash image mapping for ZIVAH International products.
 * Used as fallback when a product has no imageUrl stored in the database.
 *
 * Strategy:
 *  1. Look up by exact product slug  → per-product curated photo
 *  2. Fall back to category slug     → category-level representative photo
 *  3. Final fallback                 → generic export/agriculture photo
 *
 * All images are from Unsplash (already whitelisted in next.config.ts).
 * Append `?auto=format&fit=crop&w=600&q=75` for consistent sizing.
 */

const BASE = 'https://images.unsplash.com/photo-';
const Q = '?auto=format&fit=crop&w=600&q=75';

const PRODUCT_IMAGES: Record<string, string> = {
  // ── Seafood / Aquaculture ─────────────────────────────────────────────────
  'camaron-blanco-premium': `${BASE}1559827260-dc66d52bef19${Q}`, // reuses hero shrimp (premium Unsplash+ original removed)
  'larvas-camaron-postlarva': `${BASE}1559827260-dc66d52bef19${Q}`,
  'atun-fresco-pacifico': `${BASE}1544551763-46a013bb70d5${Q}`,

  // ── Fruits ────────────────────────────────────────────────────────────────
  'banano-cavendish-premium': `${BASE}1571771894821-ce9b6c11b08e${Q}`,
  'platano-verde': `${BASE}1571771894821-ce9b6c11b08e${Q}`,
  'mango-tommy-atkins': `${BASE}1553279768-865429fa0078${Q}`,
  'aguacate-hass-premium': `${BASE}1523049673857-eb18f1d7b578${Q}`,
  'pina-golden': `${BASE}1550258987-190a2d41a8ba${Q}`,
  'papaya-hawaiana': `${BASE}1526318896980-cf78c088247c${Q}`,
  'coco-tropical': `${BASE}1550258987-190a2d41a8ba${Q}`,

  // ── Vegetables & Roots ───────────────────────────────────────────────────
  'yuca-premium': `${BASE}1576045057995-568f588f82fb${Q}`,
  'camote-dulce': `${BASE}1596501047620-d8a592253c07${Q}`,
  'calabaza-premium': `${BASE}1570586437263-ab629fccc818${Q}`,
  'cebolla-premium': `${BASE}1587049352846-4a222e784d38${Q}`,
  'chayote-organico': `${BASE}1606923829579-0cb981a83e2e${Q}`,
  'palmito-organico': `${BASE}1526318896980-cf78c088247c${Q}`,
  'cana-azucar': `${BASE}1601050690597-df0568f70950${Q}`,
  'name-tropical': `${BASE}1576045057995-568f588f82fb${Q}`,
  nampi: `${BASE}1576045057995-568f588f82fb${Q}`,

  // ── Spices ───────────────────────────────────────────────────────────────
  'jengibre-fresco': `${BASE}1528712306091-ed0763094c98${Q}`,
  curcuma: `${BASE}1615485500704-8e990f9900f7${Q}`,

  // ── Specialty crops ───────────────────────────────────────────────────────
  'cacao-fino-aroma':
    'https://images.pexels.com/photos/7450070/pexels-photo-7450070.jpeg?auto=compress&cs=tinysrgb&w=600',
  'cafe-arabica-altura': `${BASE}1447933601403-0c6688de566e${Q}`,
  'rosas-rojas-premium':
    'https://images.pexels.com/photos/22604232/pexels-photo-22604232.jpeg?auto=compress&cs=tinysrgb&w=600',

  // ── Nuts ─────────────────────────────────────────────────────────────────
  'nueces-macadamia': `${BASE}1537202108838-e7072bad1927${Q}`,
  'nueces-pecanas': `${BASE}1537202108838-e7072bad1927${Q}`,
  'almendras-tropicales': `${BASE}1508061253366-f7da158b6d46${Q}`,

  // ── Seedlings / Trees ─────────────────────────────────────────────────────
  'arboles-mango': `${BASE}1553279768-865429fa0078${Q}`,
  'arboles-aguacate': `${BASE}1523049673857-eb18f1d7b578${Q}`,
  'arboles-citricos': `${BASE}1576045057995-568f588f82fb${Q}`, // tropical root/citrus garden
};

const CATEGORY_IMAGES: Record<string, string> = {
  agricolas: `${BASE}1464226184884-fa280b87c399${Q}`,
  'marinos-y-pesca': `${BASE}1559827260-dc66d52bef19${Q}`,
  'otros-productos': `${BASE}1490818387583-1baba5e638af${Q}`,
};

const FALLBACK = `${BASE}1464226184884-fa280b87c399${Q}`;

/**
 * Returns the best available image URL for a product.
 * Priority: stored imageUrl → per-slug mapping → category mapping → generic fallback
 */
export function getProductImage(
  slug: string,
  categorySlug?: string,
  storedUrl?: string | null
): string {
  if (storedUrl) return storedUrl;
  if (PRODUCT_IMAGES[slug]) return PRODUCT_IMAGES[slug];
  if (categorySlug && CATEGORY_IMAGES[categorySlug]) return CATEGORY_IMAGES[categorySlug];
  return FALLBACK;
}
