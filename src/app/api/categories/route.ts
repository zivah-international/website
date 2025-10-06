import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { query } from '@/lib/db';
import { createCategorySchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const includeProducts = searchParams.get('includeProducts') === 'true';
    const isActive = searchParams.get('isActive');

    let whereClause = '';
    const params: any[] = [];

    if (isActive !== null) {
      whereClause = 'WHERE is_active = ?';
      params.push(isActive === 'true');
    }

    let queryText = `
      SELECT
        c.*,
        COUNT(p.id) as products_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      ${whereClause}
      GROUP BY c.id
      ORDER BY c.is_active DESC, c.name ASC
    `;

    if (includeProducts) {
      queryText = `
        SELECT
          c.*,
          COUNT(p.id) as products_count,
          COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', p.id,
                'name', p.name,
                'slug', p.slug,
                'isFeatured', p.is_featured
              )
            ),
            JSON_ARRAY()
          ) as products
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
        ${whereClause}
        GROUP BY c.id
        ORDER BY c.is_active DESC, c.name ASC
      `;
    }

    const result = await query(queryText, params);

    return NextResponse.json({
      error: false,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);

    return NextResponse.json(
      {
        error: true,
        message: 'Error interno del servidor al obtener categorías',
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

    // Auto-generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }

    // Check if slug is unique
    const existingQuery = 'SELECT id FROM categories WHERE slug = ?';
    const existingResult = await query(existingQuery, [validatedData.slug]);

    if (existingResult.rows.length > 0) {
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
    const fields = Object.keys(validatedData);
    const values = Object.values(validatedData);
    const placeholders = fields.map(() => '?');

    const insertQuery = `
      INSERT INTO categories (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;

    const result = await query(insertQuery, values);
    // For MySQL, get the inserted record
    if (!result.insertId) {
      throw new Error('Failed to get inserted ID');
    }

    const selectResult = await query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    const category = selectResult.rows[0] as any;

    // Get product count for the new category
    const countQuery =
      'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND is_active = true';
    const countResult = await query(countQuery, [category.id]);
    category.products_count = parseInt((countResult.rows[0] as any).count);

    return NextResponse.json(
      {
        error: false,
        data: category,
        message: 'Categoría creada exitosamente',
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);

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
