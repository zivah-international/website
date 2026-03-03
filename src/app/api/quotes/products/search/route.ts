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

    // Build query using Supabase client - include prices
    let query = supabase
      .from('products')
      .select(
        `
        id,
        name,
        description,
        sku,
        measure_id,
        product_prices(
          measure_id,
          price,
          is_active
        )
      `
      )
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
      console.error('Supabase query error:', error);
      throw error;
    }

    console.error('Raw products from DB:', JSON.stringify(products, null, 2));

    // Transform products to include priceMatrix
    const transformedProducts = (products || []).map((product: any) => {
      const priceMatrix: { [key: number]: number } = {};
      let basePrice: number | undefined;

      console.error(`Processing product ${product.id} (${product.name}):`, {
        measure_id: product.measure_id,
        product_prices: product.product_prices,
      });

      // Build price matrix from product_prices
      if (product.product_prices && Array.isArray(product.product_prices)) {
        product.product_prices.forEach((pp: any) => {
          if (pp.is_active) {
            const price = parseFloat(pp.price);
            priceMatrix[pp.measure_id] = price;
            console.error(`  Added price for measure ${pp.measure_id}: $${price}`);

            // Set base price from the product's default measure
            if (pp.measure_id === product.measure_id) {
              basePrice = price;
              console.error(`  Set as base price: $${price}`);
            }
          }
        });

        // If no base price set yet, use the first active price
        if (!basePrice && product.product_prices.length > 0) {
          const firstPrice = product.product_prices.find((pp: any) => pp.is_active);
          if (firstPrice) {
            basePrice = parseFloat(firstPrice.price);
            console.error(`  Using first price as base: $${basePrice}`);
          }
        }
      }

      const result = {
        id: product.id,
        name: product.name,
        description: product.description,
        sku: product.sku,
        basePrice,
        priceMatrix: Object.keys(priceMatrix).length > 0 ? priceMatrix : undefined,
      };

      console.error(`Final product:`, result);
      return result;
    });

    // Apply translations
    const translatedProducts = await applyProductTranslations(
      supabase,
      transformedProducts,
      locale
    );

    return createApiResponse(translatedProducts);
  } catch (error) {
    return handleApiError(error);
  }
}
