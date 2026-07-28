import { NextRequest } from 'next/server';

import { query } from '@/lib/db';
import { createApiResponse, handleApiError } from '@/lib/errors';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

async function applyProductTranslations(products: any[], locale: string) {
  if (!products.length || locale === 'es') return products;

  const langResult = await query<{ id: number }>(
    `SELECT id FROM languages WHERE code = $1 AND is_active = true LIMIT 1`,
    [locale]
  );

  if (langResult.rows.length === 0) return products;

  const languageId = langResult.rows[0].id;
  const productIds = products.map((p: any) => p.id);

  const tResult = await query<{ product_id: number; name: string; description: string | null }>(
    `SELECT product_id, name, description FROM product_translations WHERE product_id = ANY($1) AND language_id = $2`,
    [productIds, languageId]
  );

  const translationsMap = new Map<number, any>();
  for (const row of tResult.rows) {
    translationsMap.set(row.product_id, row);
  }

  return products.map((product: any) => {
    const translation = translationsMap.get(product.id);
    if (translation) {
      return {
        ...product,
        name: translation.name || product.name,
        description: translation.description || product.description,
      };
    }
    return product;
  });
}

export async function GET(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    let rateLimit;
    try {
      rateLimit = await checkRateLimit(
        `api:${ip}`,
        RATE_LIMITS.API_GENERAL.limit,
        RATE_LIMITS.API_GENERAL.windowMs
      );
    } catch {
      rateLimit = { success: true };
    }

    if (!rateLimit.success) {
      return createApiResponse(null, 'Too many requests. Please try again later.', 429);
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const category = searchParams.get('category');
    const locale = searchParams.get('locale') || 'es';

    let sql = `SELECT p.id, p.name, p.description, p.sku, p.measure_id, COALESCE((SELECT json_agg(json_build_object('measure_id', pp.measure_id, 'price', pp.price, 'is_active', pp.is_active)) FROM product_prices pp WHERE pp.product_id = p.id), '[]'::json) as product_prices FROM products p WHERE p.is_active = true`;
    const params: unknown[] = [];

    if (searchQuery) {
      params.push(`%${searchQuery}%`);
      sql += ` AND p.name ILIKE $${params.length}`;
    }

    if (category) {
      const catResult = await query<{ id: number }>(
        `SELECT id FROM categories WHERE slug = $1 LIMIT 1`,
        [category]
      );
      if (catResult.rows.length > 0) {
        params.push(catResult.rows[0].id);
        sql += ` AND p.category_id = $${params.length}`;
      }
    }

    params.push(limit);
    sql += ` ORDER BY p.name ASC LIMIT $${params.length}`;

    const result = await query(sql, params);

    const transformedProducts = result.rows.map((product: any) => {
      const priceMatrix: { [key: number]: number } = {};
      let basePrice: number | undefined;

      const prices = product.product_prices || [];
      if (Array.isArray(prices)) {
        prices.forEach((pp: any) => {
          if (pp.is_active) {
            const price = parseFloat(pp.price);
            priceMatrix[pp.measure_id] = price;
            if (pp.measure_id === product.measure_id) {
              basePrice = price;
            }
          }
        });
        if (!basePrice && prices.length > 0) {
          const firstPrice = prices.find((pp: any) => pp.is_active);
          if (firstPrice) {
            basePrice = parseFloat(firstPrice.price);
          }
        }
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        sku: product.sku,
        basePrice,
        priceMatrix: Object.keys(priceMatrix).length > 0 ? priceMatrix : undefined,
      };
    });

    const translatedProducts = await applyProductTranslations(transformedProducts, locale);

    return createApiResponse(translatedProducts);
  } catch (error) {
    return handleApiError(error);
  }
}
