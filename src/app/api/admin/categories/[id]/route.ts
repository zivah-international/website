import { NextRequest, NextResponse } from 'next/server';

import { canManage, getAuthUser } from '@/lib/auth';
import { hasRole } from '@/lib/auth-shared';
import { query } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/categories/[id] - Get a single category
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

    if (!user || !canManage(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(`SELECT * FROM categories WHERE id = $1`, [parseInt(id)]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT /api/admin/categories/[id] - Update a category
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

    if (!user || !canManage(user) || !hasRole(user.role, 'sales_manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, icon, color, sort_order, is_active } = body;

    // Check for duplicate slug (excluding current category)
    const existing = await query(`SELECT id FROM categories WHERE slug = $1 AND id != $2`, [
      slug,
      parseInt(id),
    ]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    // Update the category
    const result = await query(
      `
      UPDATE categories SET
        name = $1, slug = $2, description = $3, icon = $4, color = $5,
        sort_order = $6, is_active = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING id
    `,
      [
        name,
        slug,
        description || null,
        icon || null,
        color || null,
        sort_order || 0,
        is_active ?? true,
        parseInt(id),
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Update default language translation
    const defaultLang = await query<{ id: number }>(
      `SELECT id FROM languages WHERE is_default = true LIMIT 1`
    );
    if (defaultLang.rows.length > 0) {
      await query(
        `
        UPDATE category_translations SET name = $1, description = $2, updated_at = NOW()
        WHERE category_id = $3 AND language_id = $4
      `,
        [name, description, parseInt(id), defaultLang.rows[0].id]
      );
    }

    return NextResponse.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id] - Delete a category
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

    if (!user || !canManage(user) || !hasRole(user.role, 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if category has products
    const products = await query(`SELECT COUNT(*) as count FROM products WHERE category_id = $1`, [
      parseInt(id),
    ]);
    if (parseInt((products.rows[0] as { count: string }).count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products. Remove products first.' },
        { status: 400 }
      );
    }

    // Delete translations first
    await query(`DELETE FROM category_translations WHERE category_id = $1`, [parseInt(id)]);

    // Delete the category
    const result = await query(`DELETE FROM categories WHERE id = $1 RETURNING id`, [parseInt(id)]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
