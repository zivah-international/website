import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { query } from '@/lib/db';
import { logger } from '@/lib/logger';
import { createProductSchema } from '@/lib/validations';

async function applyProductTranslations(products: any[], locale: string): Promise<any[]> {
  if (locale === 'es' || !products.length) return products;

  const langResult = await query<{ id: number }>(
    `SELECT id FROM languages WHERE code = $1 AND is_active = true LIMIT 1`,
    [locale]
  );

  if (langResult.rows.length === 0) return products;

  const languageId = langResult.rows[0].id;
  const productIds = products.map(p => p.id);

  const tResult = await query<{
    product_id: number;
    name: string;
    description: string | null;
    short_description: string | null;
  }>(
    `SELECT product_id, name, description, short_description FROM product_translations WHERE product_id = ANY($1) AND language_id = $2`,
    [productIds, languageId]
  );

  const translationsMap = new Map<number, any>();
  for (const row of tResult.rows) {
    translationsMap.set(row.product_id, row);
  }

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
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'es';

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

    let sql = `SELECT p.*, json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'description', c.description, 'icon', c.icon, 'color', c.color) as category FROM products p LEFT JOIN categories c ON p.category_id = c.id`;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filterParams.categoryId !== undefined) {
      conditions.push(`p.category_id = $${params.length + 1}`);
      params.push(filterParams.categoryId);
    }
    if (filterParams.isActive !== undefined) {
      conditions.push(`p.is_active = $${params.length + 1}`);
      params.push(filterParams.isActive);
    }
    if (filterParams.isFeatured !== undefined) {
      conditions.push(`p.is_featured = $${params.length + 1}`);
      params.push(filterParams.isFeatured);
    }
    if (filterParams.origin) {
      conditions.push(`p.origin ILIKE $${params.length + 1}`);
      params.push(`%${filterParams.origin}%`);
    }
    if (filterParams.inStock) {
      conditions.push(`p.stock_quantity > 0`);
    }
    if (filterParams.search) {
      conditions.push(
        `(p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1} OR p.slug ILIKE $${params.length + 1})`
      );
      params.push(`%${filterParams.search}%`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM (${sql}) sub`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const page = filterParams.page || 1;
    const pageSize = filterParams.pageSize || 100;
    const offset = (page - 1) * pageSize;

    sql += ` ORDER BY p.is_featured DESC, p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(pageSize, offset);

    const result = await query(sql, params);

    const translatedProducts = await applyProductTranslations(result.rows, locale);

    return NextResponse.json({
      error: false,
      data: translatedProducts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
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
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    if (!validatedData.slug) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }

    const result = await query(
      `INSERT INTO products (name, slug, description, short_description, sku, specifications, stock_quantity, min_order_qty, image_url, image_gallery, origin, harvest_season, certifications, nutritional_info, is_active, is_featured, seo_title, seo_description, measure_id, code, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *`,
      [
        validatedData.name,
        validatedData.slug,
        validatedData.description || null,
        validatedData.shortDescription || null,
        validatedData.sku || null,
        validatedData.specifications || null,
        validatedData.stockQuantity || 0,
        validatedData.minOrderQty || 1,
        validatedData.imageUrl || null,
        validatedData.imageGallery || null,
        validatedData.origin || 'Ecuador',
        validatedData.harvestSeason || null,
        validatedData.certifications || null,
        validatedData.nutritionalInfo || null,
        validatedData.isActive ?? true,
        validatedData.isFeatured ?? false,
        validatedData.seoTitle || null,
        validatedData.seoDescription || null,
        validatedData.measureId || null,
        validatedData.code || null,
        validatedData.categoryId || null,
      ]
    );

    return NextResponse.json(
      {
        error: false,
        data: result.rows[0],
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
