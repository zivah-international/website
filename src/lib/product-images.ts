const PRODUCT_IMAGES: Record<string, string> = {
  'camaron-blanco-premium': '/assets/images/products/camaron-blanco-premium.jpg',
  'larvas-camaron-postlarva': '/assets/images/products/larvas-camaron-postlarva.jpg',
  'atun-fresco-pacifico': '/assets/images/products/atun-fresco-pacifico.jpg',
  'banano-cavendish-premium': '/assets/images/products/banano-cavendish-premium.jpg',
  'platano-verde': '/assets/images/products/platano-verde.jpg',
  'mango-tommy-atkins': '/assets/images/products/mango-tommy-atkins.jpg',
  'aguacate-hass-premium': '/assets/images/products/aguacate-hass-premium.jpg',
  'pina-golden': '/assets/images/products/pina-golden.jpg',
  'papaya-hawaiana': '/assets/images/products/papaya-hawaiana.jpg',
  'coco-tropical': '/assets/images/products/coco-tropical.jpg',
  'yuca-premium': '/assets/images/products/yuca-premium.jpg',
  'camote-dulce': '/assets/images/products/camote-dulce.jpg',
  'calabaza-premium': '/assets/images/products/calabaza-premium.jpg',
  'cebolla-premium': '/assets/images/products/cebolla-premium.jpg',
  'chayote-organico': '/assets/images/products/chayote-organico.jpg',
  'palmito-organico': '/assets/images/products/palmito-organico.jpg',
  'cana-azucar': '/assets/images/products/cana-azucar.jpg',
  'name-tropical': '/assets/images/products/name-tropical.jpg',
  nampi: '/assets/images/products/nampi.jpg',
  'jengibre-fresco': '/assets/images/products/jengibre-fresco.jpg',
  curcuma: '/assets/images/products/curcuma.jpg',
  'cacao-fino-aroma': '/assets/images/products/cacao-fino-aroma.jpg',
  'cafe-arabica-altura': '/assets/images/products/cafe-arabica-altura.jpg',
  'rosas-rojas-premium': '/assets/images/products/rosas-rojas-premium.jpg',
  'nueces-macadamia': '/assets/images/products/nueces-macadamia.jpg',
  'nueces-pecanas': '/assets/images/products/nueces-pecanas.jpg',
  'almendras-tropicales': '/assets/images/products/almendras-tropicales.jpg',
  'arboles-mango': '/assets/images/products/arboles-mango.jpg',
  'arboles-aguacate': '/assets/images/products/arboles-aguacate.jpg',
  'arboles-citricos': '/assets/images/products/arboles-citricos.jpg',
};

export const PRODUCT_SLUGS = Object.keys(PRODUCT_IMAGES);

const CATEGORY_IMAGES: Record<string, string> = {
  agricolas: PRODUCT_IMAGES['banano-cavendish-premium'],
  'marinos-y-pesca': PRODUCT_IMAGES['atun-fresco-pacifico'],
  'otros-productos': PRODUCT_IMAGES['rosas-rojas-premium'],
};

const FALLBACK = PRODUCT_IMAGES['banano-cavendish-premium'];

/** Resolve only curated, locally hosted imagery. API-provided image URLs are intentionally ignored. */
export function getProductImage(slug: string, categorySlug?: string): string {
  return (
    PRODUCT_IMAGES[slug] ?? (categorySlug ? CATEGORY_IMAGES[categorySlug] : undefined) ?? FALLBACK
  );
}
