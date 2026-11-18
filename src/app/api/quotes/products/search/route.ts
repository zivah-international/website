import { NextRequest } from 'next/server';

import { query } from '@/lib/db';
import { createApiResponse, handleApiError } from '@/lib/errors';
import type { CatalogPrice, MeasureCompatibility } from '@/lib/quote-pricing';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

interface SearchMeasure {
  id: number;
  name: string;
  shortName: string;
  symbol: string | null;
  type: string;
  familyId: number | null;
  baseUnit: string | null;
  conversionFactor: string | null;
  description: string | null;
}

interface SearchProduct {
  id: number;
  name: string;
  description: string | null;
  sku: string | null;
  baseMeasureId: number | null;
  prices: CatalogPrice[];
  compatibilities: MeasureCompatibility[];
  eligibleMeasures: SearchMeasure[];
}

async function applyProductTranslations(products: SearchProduct[], locale: string) {
  if (!products.length || locale === 'es') return products;

  const langResult = await query<{ id: number }>(
    `SELECT id FROM languages WHERE code = $1 AND is_active = true LIMIT 1`,
    [locale]
  );
  if (langResult.rows.length === 0) return products;

  const productIds = products.map(product => product.id);
  const translationResult = await query<{
    product_id: number;
    name: string;
    description: string | null;
  }>(
    `SELECT product_id, name, description FROM product_translations WHERE product_id = ANY($1::int[]) AND language_id = $2`,
    [productIds, langResult.rows[0].id]
  );
  const translations = new Map(translationResult.rows.map(row => [row.product_id, row]));

  return products.map(product => {
    const translation = translations.get(product.id);
    return translation
      ? {
          ...product,
          name: translation.name || product.name,
          description: translation.description || product.description,
        }
      : product;
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
    const searchQuery = searchParams.get('q')?.trim() || '';
    const requestedLimit = Number.parseInt(searchParams.get('limit') || '10', 10);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 10;
    const category = searchParams.get('category');
    const locale = searchParams.get('locale') === 'en' ? 'en' : 'es';

    const params: unknown[] = [];
    let where = 'p.is_active = true';
    if (searchQuery) {
      params.push(`%${searchQuery}%`);
      where += ` AND (p.name ILIKE $${params.length} OR p.sku ILIKE $${params.length})`;
    }

    if (category) {
      const categoryResult = await query<{ id: number }>(
        `SELECT id FROM categories WHERE slug = $1 AND is_active = true LIMIT 1`,
        [category]
      );
      if (categoryResult.rows.length > 0) {
        params.push(categoryResult.rows[0].id);
        where += ` AND p.category_id = $${params.length}`;
      }
    }

    params.push(limit);
    const result = await query<SearchProduct>(
      `
        SELECT p.id, p.name, p.description, p.sku, active_base.id AS "baseMeasureId",
          COALESCE((
            SELECT json_agg(json_build_object(
              'measureId', pp.measure_id,
              'price', pp.price::text,
              'isActive', pp.is_active,
              'effectiveDate', pp.effective_date::text
            ) ORDER BY pp.measure_id)
            FROM product_prices pp
            JOIN measures priced_measure ON priced_measure.id = pp.measure_id AND priced_measure.is_active = true
            WHERE pp.product_id = p.id AND pp.is_active = true AND pp.effective_date <= NOW()
          ), '[]'::json) AS prices,
          COALESCE((
            SELECT json_agg(json_build_object(
              'fromMeasureId', mc.from_measure_id,
              'toMeasureId', mc.to_measure_id,
              'conversionFactor', mc.conversion_factor::text,
              'isActive', mc.is_active
            ))
            FROM measure_compatibility mc
            JOIN measures from_measure ON from_measure.id = mc.from_measure_id AND from_measure.is_active = true
            JOIN measures to_measure ON to_measure.id = mc.to_measure_id AND to_measure.is_active = true
            WHERE active_base.id IS NOT NULL AND mc.is_active = true AND mc.conversion_factor > 0
              AND (mc.from_measure_id = active_base.id OR mc.to_measure_id = active_base.id)
          ), '[]'::json) AS compatibilities,
          COALESCE((
            SELECT json_agg(json_build_object(
              'id', candidate.id,
              'name', candidate.name,
              'shortName', CASE WHEN candidate.type = 'WEIGHT' AND UPPER(candidate.short_name) = 'MT' THEN 't' ELSE candidate.short_name END,
              'symbol', CASE WHEN candidate.type = 'WEIGHT' AND UPPER(COALESCE(candidate.symbol, '')) = 'MT' THEN 't' ELSE candidate.symbol END,
              'type', candidate.type,
              'familyId', candidate.family_id,
              'baseUnit', candidate.base_unit,
              'conversionFactor', candidate.conversion_factor::text,
              'description', candidate.description
            ) ORDER BY candidate.sort_order, candidate.name)
            FROM measures candidate
            WHERE candidate.is_active = true AND (
              candidate.id = active_base.id
              OR (active_base.id IS NOT NULL AND EXISTS (
                SELECT 1 FROM measure_compatibility mc
                JOIN measures from_measure ON from_measure.id = mc.from_measure_id AND from_measure.is_active = true
                JOIN measures to_measure ON to_measure.id = mc.to_measure_id AND to_measure.is_active = true
                WHERE mc.is_active = true AND mc.conversion_factor > 0
                  AND ((mc.from_measure_id = active_base.id AND mc.to_measure_id = candidate.id)
                    OR (mc.to_measure_id = active_base.id AND mc.from_measure_id = candidate.id))
              ))
              OR (active_base.id IS NULL AND EXISTS (
                SELECT 1 FROM product_prices direct_price
                WHERE direct_price.product_id = p.id AND direct_price.measure_id = candidate.id
                  AND direct_price.is_active = true AND direct_price.effective_date <= NOW()
              ))
            )
          ), '[]'::json) AS "eligibleMeasures"
        FROM products p
        LEFT JOIN measures active_base ON active_base.id = p.measure_id AND active_base.is_active = true
        WHERE ${where}
        ORDER BY p.name ASC
        LIMIT $${params.length}
      `,
      params
    );

    const translatedProducts = await applyProductTranslations(result.rows, locale);
    return createApiResponse(translatedProducts);
  } catch (error) {
    return handleApiError(error);
  }
}
