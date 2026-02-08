import { NextRequest, NextResponse } from 'next/server';

import { canManage, getAuthUser } from '@/lib/auth';
import { hasRole } from '@/lib/auth-shared';
import { query } from '@/lib/db';

// GET /api/admin/categories - List all categories
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user || !canManage(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(`
      SELECT
        c.*,
        COUNT(p.id)::int as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.sort_order, c.name
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/admin/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user || !canManage(user) || !hasRole(user.role, 'sales_manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, icon, color, sort_order, is_active } = body;

    // Check for duplicate slug
    const existing = await query(`SELECT id FROM categories WHERE slug = $1`, [slug]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    // Insert the category
    const result = await query<{ id: number }>(
      `
      INSERT INTO categories (name, slug, description, icon, color, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
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
      ]
    );

    const categoryId = result.rows[0].id;

    // Create default Spanish translation
    const defaultLang = await query<{ id: number }>(
      `SELECT id FROM languages WHERE is_default = true LIMIT 1`
    );
    if (defaultLang.rows.length > 0) {
      await query(
        `
        INSERT INTO category_translations (category_id, language_id, name, description)
        VALUES ($1, $2, $3, $4)
      `,
        [categoryId, defaultLang.rows[0].id, name, description]
      );
    }

    return NextResponse.json(
      { id: categoryId, message: 'Category created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
