import { NextRequest, NextResponse } from 'next/server';

import { canManage, getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/products/[id] - Get a single product
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

    if (!user || !canManage(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      `
      SELECT
        p.*,
        c.name as category_name,
        m.name as measure_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN measures m ON p.measure_id = m.id
      WHERE p.id = $1
    `,
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT /api/admin/products/[id] - Update a product
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    // Check for duplicate slug (excluding current product)
    const existing = await query(`SELECT id FROM products WHERE slug = $1 AND id != $2`, [
      slug,
      parseInt(id),
    ]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    // Update the product
    const result = await query(
      `
      UPDATE products SET
        name = $1, slug = $2, code = $3, category_id = $4, description = $5,
        short_description = $6, sku = $7, stock_quantity = $8, min_order_qty = $9,
        image_url = $10, origin = $11, harvest_season = $12, is_active = $13,
        is_featured = $14, seo_title = $15, seo_description = $16, measure_id = $17,
        updated_at = NOW()
      WHERE id = $18
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
        parseInt(id),
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update default language translation
    const defaultLang = await query<{ id: number }>(
      `SELECT id FROM languages WHERE is_default = true LIMIT 1`
    );
    if (defaultLang.rows.length > 0) {
      await query(
        `
        UPDATE product_translations SET
          name = $1, description = $2, short_description = $3, seo_title = $4, seo_description = $5, updated_at = NOW()
        WHERE product_id = $6 AND language_id = $7
      `,
        [
          name,
          description,
          short_description,
          seo_title,
          seo_description,
          parseInt(id),
          defaultLang.rows[0].id,
        ]
      );
    }

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] - Delete a product
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

    if (!user || !canManage(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete translations first (cascade should handle this but let's be safe)
    await query(`DELETE FROM product_translations WHERE product_id = $1`, [parseInt(id)]);

    // Delete the product
    const result = await query(`DELETE FROM products WHERE id = $1 RETURNING id`, [parseInt(id)]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
