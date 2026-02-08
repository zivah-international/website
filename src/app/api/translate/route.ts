import { NextRequest, NextResponse } from 'next/server';

import { isValidLocale, type Locale } from '@/i18n/config';
import { type TranslationProvider, TranslationService } from '@/lib/services/translation-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, targetLanguage, sourceLanguage = 'es', provider = 'openai' } = body;

    // Validate required fields
    if (!targetLanguage) {
      return NextResponse.json({ error: 'targetLanguage is required' }, { status: 400 });
    }

    if (!text && !texts) {
      return NextResponse.json({ error: 'Either text or texts is required' }, { status: 400 });
    }

    // Validate locales
    if (!isValidLocale(targetLanguage)) {
      return NextResponse.json({ error: 'Invalid targetLanguage' }, { status: 400 });
    }

    if (!isValidLocale(sourceLanguage)) {
      return NextResponse.json({ error: 'Invalid sourceLanguage' }, { status: 400 });
    }

    const translator = new TranslationService(provider as TranslationProvider);

    // Handle batch translation
    if (texts && Array.isArray(texts)) {
      const result = await translator.translateBatch(
        texts,
        targetLanguage as Locale,
        sourceLanguage as Locale
      );
      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    // Handle single translation
    const result = await translator.translate(
      text,
      targetLanguage as Locale,
      sourceLanguage as Locale
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      {
        error: 'Translation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
