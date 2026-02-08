import { NextRequest } from 'next/server';

import { query } from '@/lib/db';
import { createApiResponse, handleApiError } from '@/lib/errors';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

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
      return createApiResponse(null, 'Demasiadas solicitudes. Intente nuevamente más tarde.', 429);
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const category = searchParams.get('category');

    let paramIndex = 1;
    let sql = `
      SELECT p.id, p.name, p.description, p.sku
      FROM products p
      WHERE p.is_active = true
      AND LOWER(p.name) LIKE LOWER($${paramIndex})
    `;
    const params: any[] = [`%${searchQuery}%`];
    paramIndex++;

    if (category) {
      sql += ` AND p.category_id = (SELECT id FROM categories WHERE slug = $${paramIndex})`;
      params.push(category);
      paramIndex++;
    }

    sql += ` ORDER BY p.name ASC LIMIT $${paramIndex}`;
    params.push(limit);

    const products = await query(sql, params);

    return createApiResponse(products.rows);
  } catch (error) {
    return handleApiError(error);
  }
}
