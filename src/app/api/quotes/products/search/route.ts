import { NextRequest } from 'next/server';

import { createApiResponse, handleApiError } from '@/lib/errors';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { createClient } from '@/utils/supabase/server';

// Helper function to apply product translations
async function applyProductTranslations(
  supabase: Awaited<ReturnType<typeof createClient>>,
  products: any[],
  locale: string
) {
  if (!products.length || locale === 'es') return products;

  // Get language ID for the locale
  const { data: langData } = await supabase
    .from('languages')
    .select('id')
    .eq('code', locale)
    .single();

  if (!langData) {
    return products;
  }

  const languageId = langData.id;
  const productIds = products.map((p: any) => p.id);

  // Get translations for all products
  const { data: translations } = await supabase
    .from('product_translations')
    .select('product_id, name, description')
    .in('product_id', productIds)
    .eq('language_id', languageId);

  if (!translations) {
    return products;
  }

  // Create a map of translations
  const translationsMap = new Map<number, any>();
  for (const row of translations) {
    translationsMap.set(row.product_id, row);
  }

  // Apply translations to products
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
    // Rate limiting: 50 requests per minute
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
      // Continue without rate limiting if it fails
      rateLimit = { success: true };
    }

    if (!rateLimit.success) {
      return createApiResponse(null, 'Too many requests. Please try again later.', 429);
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const category = searchParams.get('category');
    const locale = searchParams.get('locale') || 'es';

    // Build query using Supabase client
    let query = supabase
      .from('products')
      .select('id, name, description, sku')
      .eq('is_active', true)
      .ilike('name', `%${searchQuery}%`)
      .order('name', { ascending: true })
      .limit(limit);

    // Add category filter if provided
    if (category) {
      // Get category ID from slug
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();

      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    const { data: products, error } = await query;

    if (error) {
      throw error;
    }

    // Apply translations
    const translatedProducts = await applyProductTranslations(supabase, products || [], locale);

    return createApiResponse(translatedProducts);
  } catch (error) {
    return handleApiError(error);
  }
}
