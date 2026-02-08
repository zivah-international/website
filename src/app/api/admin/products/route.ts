import { NextRequest, NextResponse } from 'next/server';

import { canManage, getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

// GET /api/admin/products - List all products
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user || !canManage(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(`
      SELECT
        p.*,
        c.name as category_name,
        m.name as measure_name,
        m.short_name as measure_short_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN measures m ON p.measure_id = m.id
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user || !canManage(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      code,
      category_id,
      description,
      short_description,
      sku,
      stock_quantity,
      min_order_qty,
      image_url,
      origin,
      harvest_season,
      is_active,
      is_featured,
      seo_title,
      seo_description,
      measure_id,
    } = body;

    // Check for duplicate slug
    const existing = await query(`SELECT id FROM products WHERE slug = $1`, [slug]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    // Insert the product
    const result = await query<{ id: number }>(
      `
      INSERT INTO products (
        name, slug, code, category_id, description, short_description, sku,
        stock_quantity, min_order_qty, image_url, origin, harvest_season,
        is_active, is_featured, seo_title, seo_description, measure_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id
    `,
      [
        name,
        slug,
        code || null,
        category_id || null,
        description || null,
        short_description || null,
        sku || null,
        stock_quantity || 0,
        min_order_qty || 1,
        image_url || null,
        origin || 'Ecuador',
        harvest_season || null,
        is_active ?? true,
        is_featured ?? false,
        seo_title || null,
        seo_description || null,
        measure_id || null,
      ]
    );

    const productId = result.rows[0].id;

    // Create default Spanish translation
    const defaultLang = await query<{ id: number }>(
      `SELECT id FROM languages WHERE is_default = true LIMIT 1`
    );
    if (defaultLang.rows.length > 0) {
      await query(
        `
        INSERT INTO product_translations (product_id, language_id, name, description, short_description, seo_title, seo_description, is_auto_translated)
        VALUES ($1, $2, $3, $4, $5, $6, $7, false)
      `,
        [
          productId,
          defaultLang.rows[0].id,
          name,
          description,
          short_description,
          seo_title,
          seo_description,
        ]
      );
    }

    return NextResponse.json(
      { id: productId, message: 'Product created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
