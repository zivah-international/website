import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { query } from '@/lib/db';
import { logger } from '@/lib/logger';
import { createCategorySchema } from '@/lib/validations';

async function applyCategoryTranslations(categories: any[], locale: string): Promise<any[]> {
  if (locale === 'es' || !categories.length) return categories;

  const langResult = await query<{ id: number }>(
    `SELECT id FROM languages WHERE code = $1 AND is_active = true LIMIT 1`,
    [locale]
  );

  if (langResult.rows.length === 0) return categories;

  const languageId = langResult.rows[0].id;
  const categoryIds = categories.map(c => c.id);

  const tResult = await query<{ category_id: number; name: string; description: string | null }>(
    `SELECT category_id, name, description FROM category_translations WHERE category_id = ANY($1) AND language_id = $2`,
    [categoryIds, languageId]
  );

  const translationsMap = new Map<number, any>();
  for (const row of tResult.rows) {
    translationsMap.set(row.category_id, row);
  }

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
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'es';
    const includeProducts = searchParams.get('includeProducts') === 'true';
    const isActive = searchParams.get('isActive');

    let sql = `SELECT c.*, COALESCE(json_agg(json_build_object('id', p.id, 'name', p.name, 'slug', p.slug, 'is_featured', p.is_featured, 'is_active', p.is_active) ORDER BY p.name) FILTER (WHERE p.id IS NOT NULL), '[]'::json) as products FROM categories c LEFT JOIN products p ON c.id = p.category_id`;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (isActive !== null) {
      conditions.push(`c.is_active = $${params.length + 1}`);
      params.push(isActive === 'true');
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` GROUP BY c.id ORDER BY c.is_active DESC, c.name ASC`;

    const result = await query(sql, params);

    const processedCategories = result.rows.map((category: any) => {
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

    const translatedCategories = await applyCategoryTranslations(processedCategories, locale);

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
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);

    if (!validatedData.slug) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }

    const existing = await query(`SELECT id FROM categories WHERE slug = $1 LIMIT 1`, [
      validatedData.slug,
    ]);

    if (existing.rows.length > 0) {
      return NextResponse.json(
        {
          error: true,
          message: 'Ya existe una categoría con este slug',
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    const result = await query(
      `INSERT INTO categories (name, slug, description, icon, color, sort_order, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        validatedData.name,
        validatedData.slug,
        validatedData.description || null,
        validatedData.icon || null,
        validatedData.color || null,
        validatedData.sortOrder || 0,
        validatedData.isActive ?? true,
      ]
    );

    const row = result.rows[0] ?? {};
    return NextResponse.json(
      {
        error: false,
        data: { ...row, products_count: 0 },
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
