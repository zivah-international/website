import { NextRequest } from 'next/server';

import { createApiResponse, handleApiError } from '@/lib/errors';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { createClient } from '@/utils/supabase/server';

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

    const supabase = await createClient();

    const { data: measures, error } = await supabase
      .from('measures')
      .select('id, name, short_name, symbol, type, base_unit, conversion_factor, description')
      .eq('is_active', true)
      .order('type', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return createApiResponse(measures);
  } catch (error) {
    return handleApiError(error);
  }
}
