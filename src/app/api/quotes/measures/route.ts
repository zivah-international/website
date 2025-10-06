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

    const measures = await query(`
      SELECT id, name, short_name, symbol, type, base_unit, conversion_factor, description
      FROM measures
      WHERE is_active = true
      ORDER BY type ASC, sort_order ASC
    `);

    return createApiResponse(measures.rows);
  } catch (error) {
    return handleApiError(error);
  }
}
