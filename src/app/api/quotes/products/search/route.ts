import { NextRequest } from 'next/server';

import { query } from '@/lib/db';
import { createApiResponse, handleApiError } from '@/lib/errors';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// Helper function to apply product translations
async function applyProductTranslations(products: any[], locale: string) {
  if (!products.length || locale === 'es') return products;

  const productIds = products.map(p => p.id);
  const placeholders = productIds.map((_, i) => `$${i + 2}`).join(',');

  const translationsResult = await query(
    `SELECT product_id, name, description
     FROM product_translations
     WHERE product_id IN (${placeholders}) AND language_code = $1`,
    [locale, ...productIds]
  );

  const translationsMap = new Map();
  translationsResult.rows.forEach((t: any) => {
    translationsMap.set(t.product_id, t);
  });

  return products.map(product => {
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
    // Rate limiting: 50 requests per minute
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = await checkRateLimit(
      `api:${ip}`,
      RATE_LIMITS.API_GENERAL.limit,
      RATE_LIMITS.API_GENERAL.windowMs
    );

    if (!rateLimit.success) {
      return createApiResponse(null, 'Too many requests. Please try again later.', 429);
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const category = searchParams.get('category');
    const locale = searchParams.get('locale') || 'es';

    let paramIndex = 1;
    let sql = `
      SELECT p.id, p.name, p.description, p.sku
      FROM products p
      WHERE p.is_active = true
      AND LOWER(p.name) LIKE LOWER($${paramIndex})
    `;
    const params: any[] = [`%${searchQuery}%`];
    paramIndex++;

    // Also search in translations if not Spanish
    if (locale !== 'es') {
      sql = `
        SELECT DISTINCT p.id, p.name, p.description, p.sku
        FROM products p
        LEFT JOIN product_translations pt ON p.id = pt.product_id AND pt.language_code = $${paramIndex}
        WHERE p.is_active = true
        AND (LOWER(p.name) LIKE LOWER($1) OR LOWER(pt.name) LIKE LOWER($1))
      `;
      params.push(locale);
      paramIndex++;
    }

    if (category) {
      sql += ` AND p.category_id = (SELECT id FROM categories WHERE slug = $${paramIndex})`;
      params.push(category);
      paramIndex++;
    }

    sql += ` ORDER BY p.name ASC LIMIT $${paramIndex}`;
    params.push(limit);

    const products = await query(sql, params);

    // Apply translations
    const translatedProducts = await applyProductTranslations(products.rows, locale);

    return createApiResponse(translatedProducts);
  } catch (error) {
    return handleApiError(error);
  }
}
