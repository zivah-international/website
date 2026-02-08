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

    const { data: countries, error } = await supabase
      .from('countries')
      .select(
        `
        id,
        name,
        code,
        icon,
        calling_code,
        phone_format,
        currency:currencies(
          id,
          code,
          name,
          symbol
        )
      `
      )
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return createApiResponse(countries);
  } catch (error) {
    return handleApiError(error);
  }
}
