'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

import { type Locale } from '@/i18n/config';

interface TranslatedContent<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface TranslationItem {
  language?: { code: string };
  languageId?: string;
  [key: string]: unknown;
}

/**
 * Hook to get translated content based on current locale
 * Falls back to default locale content if translation is not available
 */
export function useTranslatedContent<T extends { translations?: TranslationItem[] }>(
  content: T | null,
  translationFields: string[] = ['name', 'description', 'shortDescription']
): T | null {
  const locale = useLocale() as Locale;

  if (!content) return null;

  // If no translations or default locale, return original content
  if (!content.translations || locale === 'es') {
    return content;
  }

  // Find translation for current locale
  const translation = content.translations.find(
    t => t.language?.code === locale || t.languageId === locale
  );

  if (!translation) {
    return content; // Fallback to original
  }

  // Merge translation with original content
  const translatedContent = { ...content } as T & Record<string, unknown>;

  for (const field of translationFields) {
    if (translation[field]) {
      (translatedContent as Record<string, unknown>)[field] = translation[field];
    }
  }

  return translatedContent;
}

/**
 * Hook to translate text dynamically using the API
 */
export function useAutoTranslate(
  text: string,
  sourceLanguage: Locale = 'es'
): TranslatedContent<string> {
  const locale = useLocale() as Locale;
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // No need to translate if same language
    if (locale === sourceLanguage || !text) {
      setData(text);
      return;
    }

    const translate = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            targetLanguage: locale,
            sourceLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error('Translation failed');
        }

        const result = await response.json();
        setData(result.data?.text || text);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData(text); // Fallback to original text
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [text, locale, sourceLanguage]);

  return { data, isLoading, error };
}

/**
 * Hook for batch translations
 */
export function useAutoTranslateBatch(
  texts: string[],
  sourceLanguage: Locale = 'es'
): TranslatedContent<string[]> {
  const locale = useLocale() as Locale;
  const [data, setData] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (locale === sourceLanguage || !texts.length) {
      setData(texts);
      return;
    }

    const translate = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            texts,
            targetLanguage: locale,
            sourceLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error('Translation failed');
        }

        const result = await response.json();
        interface TranslationItem {
          text: string;
        }
        const translatedTexts =
          result.data?.translations?.map((t: TranslationItem) => t.text) || texts;
        setData(translatedTexts);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData(texts);
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [texts, locale, sourceLanguage]);

  return { data, isLoading, error };
}

/**
 * Utility function to get translated field value
 */
export function getTranslatedField<T extends Record<string, unknown>>(
  item: T,
  field: keyof T,
  locale: Locale,
  translations?: Array<
    { language?: { code: string }; languageId?: string } & Record<string, unknown>
  >
): T[keyof T] {
  if (!translations || locale === 'es') {
    return item[field];
  }

  const translation = translations.find(
    t => t.language?.code === locale || t.languageId === locale
  );

  if (translation && translation[field as string]) {
    return translation[field as string] as T[keyof T];
  }

  return item[field];
}
