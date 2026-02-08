/**
 * Translation Service for ZIVAH International
 *
 * Supports automatic translation using:
 * - OpenAI GPT-4 (high quality, context-aware)
 * - DeepL API (best for European languages)
 * - Google Cloud Translation (fast, affordable)
 */

import { type Locale } from '@/i18n/config';

export type TranslationProvider = 'openai' | 'deepl' | 'google';

interface TranslationResult {
  text: string;
  provider: TranslationProvider;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
}

interface TranslationBatchResult {
  translations: TranslationResult[];
  provider: TranslationProvider;
  totalTokens?: number;
}

interface DeepLTranslation {
  text: string;
}

interface GoogleTranslation {
  translatedText: string;
}

// Language code mappings for different providers
const languageCodeMap: Record<TranslationProvider, Record<Locale, string>> = {
  openai: { es: 'Spanish', en: 'English' },
  deepl: { es: 'ES', en: 'EN-US' },
  google: { es: 'es', en: 'en' },
};

export class TranslationService {
  private provider: TranslationProvider;
  private apiKey: string;

  constructor(provider: TranslationProvider = 'openai') {
    this.provider = provider;
    this.apiKey = this.getApiKey();
  }

  private getApiKey(): string {
    switch (this.provider) {
      case 'openai':
        return process.env.OPENAI_API_KEY || '';
      case 'deepl':
        return process.env.DEEPL_API_KEY || '';
      case 'google':
        return process.env.GOOGLE_TRANSLATE_API_KEY || '';
      default:
        return '';
    }
  }

  /**
   * Translate a single text string
   */
  async translate(
    text: string,
    targetLanguage: Locale,
    sourceLanguage: Locale = 'es'
  ): Promise<TranslationResult> {
    if (!this.apiKey) {
      throw new Error(`API key not configured for ${this.provider}`);
    }

    switch (this.provider) {
      case 'openai':
        return this.translateWithOpenAI(text, targetLanguage, sourceLanguage);
      case 'deepl':
        return this.translateWithDeepL(text, targetLanguage, sourceLanguage);
      case 'google':
        return this.translateWithGoogle(text, targetLanguage, sourceLanguage);
      default:
        throw new Error(`Unknown provider: ${this.provider}`);
    }
  }

  /**
   * Translate multiple texts in batch (more efficient)
   */
  async translateBatch(
    texts: string[],
    targetLanguage: Locale,
    sourceLanguage: Locale = 'es'
  ): Promise<TranslationBatchResult> {
    if (!this.apiKey) {
      throw new Error(`API key not configured for ${this.provider}`);
    }

    switch (this.provider) {
      case 'openai':
        return this.translateBatchWithOpenAI(texts, targetLanguage, sourceLanguage);
      case 'deepl':
        return this.translateBatchWithDeepL(texts, targetLanguage, sourceLanguage);
      case 'google':
        return this.translateBatchWithGoogle(texts, targetLanguage, sourceLanguage);
      default:
        throw new Error(`Unknown provider: ${this.provider}`);
    }
  }

  /**
   * Translate product content (optimized for product data)
   */
  async translateProduct(
    product: {
      name: string;
      description?: string;
      shortDescription?: string;
      seoTitle?: string;
      seoDescription?: string;
    },
    targetLanguage: Locale,
    sourceLanguage: Locale = 'es'
  ): Promise<{
    name: string;
    description?: string;
    shortDescription?: string;
    seoTitle?: string;
    seoDescription?: string;
  }> {
    const texts: string[] = [];
    const fields: string[] = [];

    if (product.name) {
      texts.push(product.name);
      fields.push('name');
    }
    if (product.description) {
      texts.push(product.description);
      fields.push('description');
    }
    if (product.shortDescription) {
      texts.push(product.shortDescription);
      fields.push('shortDescription');
    }
    if (product.seoTitle) {
      texts.push(product.seoTitle);
      fields.push('seoTitle');
    }
    if (product.seoDescription) {
      texts.push(product.seoDescription);
      fields.push('seoDescription');
    }

    const result = await this.translateBatch(texts, targetLanguage, sourceLanguage);

    const translated: Record<string, string | undefined> = {};
    fields.forEach((field, index) => {
      translated[field] =
        result.translations[index]?.text || product[field as keyof typeof product];
    });

    return translated as {
      name: string;
      description?: string;
      shortDescription?: string;
      seoTitle?: string;
      seoDescription?: string;
    };
  }

  // OpenAI Translation Implementation
  private async translateWithOpenAI(
    text: string,
    targetLanguage: Locale,
    sourceLanguage: Locale
  ): Promise<TranslationResult> {
    const targetLangName = languageCodeMap.openai[targetLanguage];
    const sourceLangName = languageCodeMap.openai[sourceLanguage];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate from ${sourceLangName} to ${targetLangName}. Only respond with the translation, nothing else.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0]?.message?.content?.trim() || text;

    return {
      text: translatedText,
      provider: 'openai',
      sourceLanguage,
      targetLanguage,
    };
  }

  private async translateBatchWithOpenAI(
    texts: string[],
    targetLanguage: Locale,
    sourceLanguage: Locale
  ): Promise<TranslationBatchResult> {
    const targetLangName = languageCodeMap.openai[targetLanguage];
    const sourceLangName = languageCodeMap.openai[sourceLanguage];
    const numberedTexts = texts.map((t, i) => `[${i + 1}] ${t}`).join('\n');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Translate from ${sourceLangName} to ${targetLangName}. Return translations in format: [1] translation1\n[2] translation2`,
          },
          {
            role: 'user',
            content: numberedTexts,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim() || '';

    const translations: TranslationResult[] = [];
    for (let i = 0; i < texts.length; i++) {
      const pattern = new RegExp(`\\[${i + 1}\\]\\s*(.+)`, 's');
      const match = content.match(pattern);
      translations.push({
        text: match ? match[1].trim() : texts[i],
        provider: 'openai',
        sourceLanguage,
        targetLanguage,
      });
    }

    return {
      translations,
      provider: 'openai',
      totalTokens: data.usage?.total_tokens,
    };
  }

  // DeepL Translation Implementation
  private async translateWithDeepL(
    text: string,
    targetLanguage: Locale,
    sourceLanguage: Locale
  ): Promise<TranslationResult> {
    const targetLang = languageCodeMap.deepl[targetLanguage];
    const sourceLang = languageCodeMap.deepl[sourceLanguage];

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `DeepL-Auth-Key ${this.apiKey}`,
      },
      body: new URLSearchParams({
        text,
        source_lang: sourceLang,
        target_lang: targetLang,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`DeepL API error: ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const translatedText = data.translations[0]?.text || text;

    return {
      text: translatedText,
      provider: 'deepl',
      sourceLanguage,
      targetLanguage,
    };
  }

  private async translateBatchWithDeepL(
    texts: string[],
    targetLanguage: Locale,
    sourceLanguage: Locale
  ): Promise<TranslationBatchResult> {
    const targetLang = languageCodeMap.deepl[targetLanguage];
    const sourceLang = languageCodeMap.deepl[sourceLanguage];

    const params = new URLSearchParams();
    texts.forEach(text => params.append('text', text));
    params.append('source_lang', sourceLang);
    params.append('target_lang', targetLang);

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `DeepL-Auth-Key ${this.apiKey}`,
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`DeepL API error: ${error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const translations: TranslationResult[] = (data.translations as DeepLTranslation[]).map(
      (t, i) => ({
        text: t.text || texts[i],
        provider: 'deepl' as const,
        sourceLanguage,
        targetLanguage,
      })
    );

    return { translations, provider: 'deepl' };
  }

  // Google Cloud Translation Implementation
  private async translateWithGoogle(
    text: string,
    targetLanguage: Locale,
    sourceLanguage: Locale
  ): Promise<TranslationResult> {
    const targetLang = languageCodeMap.google[targetLanguage];
    const sourceLang = languageCodeMap.google[sourceLanguage];

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const translatedText = data.data?.translations[0]?.translatedText || text;

    return {
      text: translatedText,
      provider: 'google',
      sourceLanguage,
      targetLanguage,
    };
  }

  private async translateBatchWithGoogle(
    texts: string[],
    targetLanguage: Locale,
    sourceLanguage: Locale
  ): Promise<TranslationBatchResult> {
    const targetLang = languageCodeMap.google[targetLanguage];
    const sourceLang = languageCodeMap.google[sourceLanguage];

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: texts,
          source: sourceLang,
          target: targetLang,
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const translations: TranslationResult[] = (
      (data.data?.translations || []) as GoogleTranslation[]
    ).map((t, i) => ({
      text: t.translatedText || texts[i],
      provider: 'google' as const,
      sourceLanguage,
      targetLanguage,
    }));

    return { translations, provider: 'google' };
  }
}

// Singleton instance
let translationService: TranslationService | null = null;

export function getTranslationService(
  provider: TranslationProvider = 'openai'
): TranslationService {
  if (!translationService) {
    translationService = new TranslationService(provider);
  }
  return translationService;
}

// Helper function for quick translations
export async function translateText(
  text: string,
  targetLanguage: Locale,
  sourceLanguage: Locale = 'es',
  provider: TranslationProvider = 'openai'
): Promise<string> {
  const service = getTranslationService(provider);
  const result = await service.translate(text, targetLanguage, sourceLanguage);
  return result.text;
}

export default TranslationService;
