import { NextRequest, NextResponse } from 'next/server';

import { canManage, getAuthUser } from '@/lib/auth';
import { hasRole } from '@/lib/auth-shared';
import { query } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface TranslationInput {
  languageCode: string;
  name: string;
  description: string;
}

// GET /api/admin/categories/[id]/translations - Get all translations for a category
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
        ct.*,
        l.code as language_code,
        l.name as language_name,
        l.native_name as language_native_name,
        l.is_default as language_is_default
      FROM category_translations ct
      JOIN languages l ON ct.language_id = l.id
      WHERE ct.category_id = $1
      ORDER BY l.sort_order, l.name
    `,
      [parseInt(id)]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}

// PUT /api/admin/categories/[id]/translations - Update all translations for a category
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    const user = await getAuthUser();

    if (!user || !canManage(user) || !hasRole(user.role, 'sales_manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { translations } = body as { translations: TranslationInput[] };

    if (!translations || !Array.isArray(translations)) {
      return NextResponse.json({ error: 'Invalid translations data' }, { status: 400 });
    }

    // Get all languages
    const languages = await query<{ id: number; code: string; is_default: boolean }>(`
      SELECT id, code, is_default FROM languages WHERE is_active = true
    `);
    const langMap = new Map(languages.rows.map(l => [l.code, l]));

    // Process each translation
    for (const trans of translations) {
      const lang = langMap.get(trans.languageCode);
      if (!lang) continue;

      // Skip empty translations for non-default languages
      if (!lang.is_default && !trans.name?.trim()) {
        // Delete existing translation if it exists
        await query(
          `DELETE FROM category_translations WHERE category_id = $1 AND language_id = $2`,
          [categoryId, lang.id]
        );
        continue;
      }

      // Upsert translation
      await query(
        `
        INSERT INTO category_translations (category_id, language_id, name, description)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (category_id, language_id)
        DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          updated_at = NOW()
      `,
        [categoryId, lang.id, trans.name || '', trans.description || null]
      );

      // If this is the default language, also update the category's main fields
      if (lang.is_default) {
        await query(
          `
          UPDATE categories SET name = $1, description = $2, updated_at = NOW()
          WHERE id = $3
        `,
          [trans.name, trans.description, categoryId]
        );
      }
    }

    return NextResponse.json({ message: 'Translations saved successfully' });
  } catch (error) {
    console.error('Error saving translations:', error);
    return NextResponse.json({ error: 'Failed to save translations' }, { status: 500 });
  }
}
