import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { logger } from '@/lib/logger';
import { createProductSchema } from '@/lib/validations';
import { createClient } from '@/utils/supabase/server';

// Helper to apply translations to products
async function applyProductTranslations(
  supabase: Awaited<ReturnType<typeof createClient>>,
  products: any[],
  locale: string
): Promise<any[]> {
  if (locale === 'es' || !products.length) {
    return products;
  }

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
  const productIds = products.map(p => p.id);

  // Get translations for all products
  const { data: translations } = await supabase
    .from('product_translations')
    .select('product_id, name, description, short_description')
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
  return products.map(product => {
    const translation = translationsMap.get(product.id);
    if (translation) {
      return {
        ...product,
        name: translation.name || product.name,
        description: translation.description || product.description,
        shortDescription: translation.short_description || product.shortDescription,
      };
    }
    return product;
  });
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'es';

    // Parse and validate query parameters
    const filterParams = {
      categoryId: searchParams.get('categoryId')
        ? parseInt(searchParams.get('categoryId')!)
        : undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      isFeatured: searchParams.get('isFeatured')
        ? searchParams.get('isFeatured') === 'true'
        : undefined,
      search: searchParams.get('search') || undefined,
      origin: searchParams.get('origin') || undefined,
      inStock: searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 100,
    };

    // Build query
    let query = supabase.from('products').select(
      `
      *,
      category:categories(id, name, slug, description, icon, color)
    `,
      { count: 'exact' }
    );

    // Apply filters
    if (filterParams.categoryId !== undefined) {
      query = query.eq('category_id', filterParams.categoryId);
    }
    if (filterParams.isActive !== undefined) {
      query = query.eq('is_active', filterParams.isActive);
    }
    if (filterParams.isFeatured !== undefined) {
      query = query.eq('is_featured', filterParams.isFeatured);
    }
    if (filterParams.origin) {
      query = query.ilike('origin', `%${filterParams.origin}%`);
    }
    if (filterParams.inStock) {
      query = query.gt('stock_quantity', 0);
    }
    if (filterParams.search) {
      query = query.or(
        `name.ilike.%${filterParams.search}%,description.ilike.%${filterParams.search}%`
      );
    }

    // Pagination
    const page = filterParams.page || 1;
    const pageSize = filterParams.pageSize || 100;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data: products, error, count } = await query;

    if (error) {
      throw error;
    }

    // Apply translations if locale is not Spanish
    const translatedProducts = await applyProductTranslations(supabase, products || [], locale);

    return NextResponse.json({
      error: false,
      data: translatedProducts,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error('Error fetching products:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: true,
          message: 'Parámetros de búsqueda inválidos',
          details: error.issues,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: true,
        message: 'Error interno del servidor al obtener productos',
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Auto-generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        error: false,
        data: product,
        message: 'Product created successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    logger.error('Error creating product:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: true,
          message: 'Datos del producto inválidos',
          details: error.issues,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: true,
        message: 'Error interno del servidor al crear producto',
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
