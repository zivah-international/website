import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { logger } from '@/lib/logger';
import { createCategorySchema } from '@/lib/validations';
import { createClient } from '@/utils/supabase/server';

// Helper to apply translations to categories
async function applyCategoryTranslations(
  supabase: Awaited<ReturnType<typeof createClient>>,
  categories: any[],
  locale: string
): Promise<any[]> {
  if (locale === 'es' || !categories.length) {
    return categories;
  }

  // Get language ID for the locale
  const { data: langData } = await supabase
    .from('languages')
    .select('id')
    .eq('code', locale)
    .single();

  if (!langData) {
    return categories;
  }

  const languageId = langData.id;
  const categoryIds = categories.map(c => c.id);

  // Get translations for all categories
  const { data: translations } = await supabase
    .from('category_translations')
    .select('category_id, name, description')
    .in('category_id', categoryIds)
    .eq('language_id', languageId);

  if (!translations) {
    return categories;
  }

  // Create a map of translations
  const translationsMap = new Map<number, any>();
  for (const row of translations) {
    translationsMap.set(row.category_id, row);
  }

  // Apply translations to categories
  return categories.map(category => {
    const translation = translationsMap.get(category.id);
    if (translation) {
      return {
        ...category,
        name: translation.name || category.name,
        description: translation.description || category.description,
      };
    }
    return category;
  });
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'es';
    const includeProducts = searchParams.get('includeProducts') === 'true';
    const isActive = searchParams.get('isActive');

    // Build query
    let query = supabase.from('categories').select(`
      *,
      products:products(id, name, slug, is_featured, is_active)
    `);

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    query = query.order('is_active', { ascending: false }).order('name', { ascending: true });

    const { data: categories, error } = await query;

    if (error) {
      throw error;
    }

    // Process categories to add products_count
    const processedCategories = (categories || []).map(category => {
      const activeProducts = (category.products || []).filter(
        (p: any) => p !== null && p.is_active
      );
      return {
        ...category,
        products_count: activeProducts.length,
        products: includeProducts
          ? activeProducts.map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              isFeatured: p.is_featured,
            }))
          : undefined,
      };
    });

    // Apply translations if locale is not Spanish
    const translatedCategories = await applyCategoryTranslations(
      supabase,
      processedCategories,
      locale
    );

    return NextResponse.json({
      error: false,
      data: translatedCategories,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error('Error fetching categories:', error);

    return NextResponse.json(
      {
        error: true,
        message: 'Error interno del servidor al obtener categorías',
        details: error.message,
        code: error.code,
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
    const validatedData = createCategorySchema.parse(body);

    // Auto-generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }

    // Check if slug is unique
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', validatedData.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        {
          error: true,
          message: 'Ya existe una categoría con este slug',
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    // Insert new category
    const { data: category, error } = await supabase
      .from('categories')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        error: false,
        data: { ...category, products_count: 0 },
        message: 'Category created successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Error creating category:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: true,
          message: 'Datos de categoría inválidos',
          details: error.issues,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: true,
        message: 'Error interno del servidor al crear categoría',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
