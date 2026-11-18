import { NextRequest } from 'next/server';

import { query } from '@/lib/db';
import { createApiResponse, handleApiError } from '@/lib/errors';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
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

    const result = await query<{
      id: number;
      name: string;
      short_name: string;
      symbol: string | null;
      type: string;
      family_id: number | null;
      base_unit: string | null;
      conversion_factor: string | null;
      description: string | null;
    }>(
      `SELECT id, name, short_name, symbol, type, family_id, base_unit, conversion_factor::text AS conversion_factor, description FROM measures WHERE is_active = true ORDER BY type ASC, sort_order ASC`
    );

    const measures = result.rows.map(measure => {
      const tonneSymbol = measure.type === 'WEIGHT' && measure.short_name.toUpperCase() === 'MT';
      return {
        id: measure.id,
        name: measure.name,
        shortName: tonneSymbol ? 't' : measure.short_name,
        symbol: tonneSymbol || measure.symbol?.toUpperCase() === 'MT' ? 't' : measure.symbol,
        type: measure.type,
        familyId: measure.family_id,
        baseUnit: measure.base_unit,
        conversionFactor: measure.conversion_factor,
        description: measure.description,
      };
    });

    return createApiResponse(measures);
  } catch (error) {
    return handleApiError(error);
  }
}
