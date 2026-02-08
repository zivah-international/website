import { NextRequest, NextResponse } from 'next/server';

import { canManage, getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface TranslationInput {
  languageCode: string;
  name: string;
  description: string;
  short_description: string;
  seo_title: string;
  seo_description: string;
}

// GET /api/admin/products/[id]/translations - Get all translations for a product
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
        pt.*,
        l.code as language_code,
        l.name as language_name,
        l.native_name as language_native_name,
        l.is_default as language_is_default
      FROM product_translations pt
      JOIN languages l ON pt.language_id = l.id
      WHERE pt.product_id = $1
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

// PUT /api/admin/products/[id]/translations - Update all translations for a product
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const user = await getAuthUser();

    if (!user || !canManage(user)) {
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
        await query(`DELETE FROM product_translations WHERE product_id = $1 AND language_id = $2`, [
          productId,
          lang.id,
        ]);
        continue;
      }

      // Upsert translation
      await query(
        `
        INSERT INTO product_translations (product_id, language_id, name, description, short_description, seo_title, seo_description, is_auto_translated)
        VALUES ($1, $2, $3, $4, $5, $6, $7, false)
        ON CONFLICT (product_id, language_id)
        DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          short_description = EXCLUDED.short_description,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          is_auto_translated = false,
          updated_at = NOW()
      `,
        [
          productId,
          lang.id,
          trans.name || '',
          trans.description || null,
          trans.short_description || null,
          trans.seo_title || null,
          trans.seo_description || null,
        ]
      );

      // If this is the default language, also update the product's main fields
      if (lang.is_default) {
        await query(
          `
          UPDATE products SET
            name = $1, description = $2, short_description = $3, seo_title = $4, seo_description = $5, updated_at = NOW()
          WHERE id = $6
        `,
          [
            trans.name,
            trans.description,
            trans.short_description,
            trans.seo_title,
            trans.seo_description,
            productId,
          ]
        );
      }
    }

    return NextResponse.json({ message: 'Translations saved successfully' });
  } catch (error) {
    console.error('Error saving translations:', error);
    return NextResponse.json({ error: 'Failed to save translations' }, { status: 500 });
  }
}
