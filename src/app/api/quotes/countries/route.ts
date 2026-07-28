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

    const result = await query(
      `SELECT c.id, c.name, c.code, c.icon, c.calling_code, c.phone_format, json_build_object('id', cur.id, 'code', cur.code, 'name', cur.name, 'symbol', cur.symbol) as currency FROM countries c LEFT JOIN currencies cur ON c.currency_id = cur.id WHERE c.is_active = true ORDER BY c.name ASC`
    );

    return createApiResponse(result.rows);
  } catch (error) {
    return handleApiError(error);
  }
}
