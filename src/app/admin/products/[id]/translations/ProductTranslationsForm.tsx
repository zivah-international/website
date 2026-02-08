'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { localeFlags } from '@/i18n/config';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

interface Language {
  id: number;
  code: string;
  name: string;
  native_name: string | null;
  is_default: boolean;
}

interface Translation {
  language_id: number;
  language_code: string;
  name: string;
  description: string | null;
  short_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_auto_translated: boolean;
}

interface TranslationFormData {
  [languageCode: string]: {
    name: string;
    description: string;
    short_description: string;
    seo_title: string;
    seo_description: string;
  };
}

interface ProductTranslationsFormProps {
  product: Product;
  languages: Language[];
  translations: Record<string, Translation>;
}

export function ProductTranslationsForm({
  product,
  languages,
  translations,
}: ProductTranslationsFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(languages[0]?.code || 'es');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form data
  const [formData, setFormData] = useState<TranslationFormData>(() => {
    const initial: TranslationFormData = {};

    languages.forEach(lang => {
      const existing = translations[lang.code];
      if (existing) {
        initial[lang.code] = {
          name: existing.name || '',
          description: existing.description || '',
          short_description: existing.short_description || '',
          seo_title: existing.seo_title || '',
          seo_description: existing.seo_description || '',
        };
      } else if (lang.is_default) {
        // Use product's original data for default language
        initial[lang.code] = {
          name: product.name || '',
          description: product.description || '',
          short_description: product.short_description || '',
          seo_title: product.seo_title || '',
          seo_description: product.seo_description || '',
        };
      } else {
        initial[lang.code] = {
          name: '',
          description: '',
          short_description: '',
          seo_title: '',
          seo_description: '',
        };
      }
    });

    return initial;
  });

  const handleFieldChange = (lang: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const handleAutoTranslate = async (targetLang: string) => {
    const defaultLang = languages.find(l => l.is_default);
    if (!defaultLang) return;

    setTranslating(true);
    setError(null);

    try {
      const sourceData = formData[defaultLang.code];

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: [
            sourceData.name,
            sourceData.description,
            sourceData.short_description,
            sourceData.seo_title,
            sourceData.seo_description,
          ].filter(Boolean),
          sourceLanguage: defaultLang.code,
          targetLanguage: targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      const translated = data.translations || [];

      let idx = 0;
      setFormData(prev => ({
        ...prev,
        [targetLang]: {
          name: sourceData.name ? translated[idx++] || '' : '',
          description: sourceData.description ? translated[idx++] || '' : '',
          short_description: sourceData.short_description ? translated[idx++] || '' : '',
          seo_title: sourceData.seo_title ? translated[idx++] || '' : '',
          seo_description: sourceData.seo_description ? translated[idx++] || '' : '',
        },
      }));

      setSuccess(`Auto-translated to ${languages.find(l => l.code === targetLang)?.name}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${product.id}/translations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          translations: Object.entries(formData).map(([langCode, data]) => ({
            languageCode: langCode,
            ...data,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save translations');
      }

      setSuccess('Translations saved successfully!');
      router.refresh();
      setTimeout(() => {
        setSuccess(null);
        router.push('/admin/products');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTranslationStatus = (langCode: string): 'complete' | 'incomplete' | 'missing' => {
    const data = formData[langCode];
    if (!data || !data.name) return 'missing';
    if (data.name && data.description) return 'complete';
    return 'incomplete';
  };

  const currentLang = languages.find(l => l.code === activeTab);
  const defaultLang = languages.find(l => l.is_default);

  return (
    <form
      onSubmit={handleSubmit}
      className='p-6'
    >
      {/* Messages */}
      {error && (
        <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
          <p className='text-red-700 dark:text-red-400'>{error}</p>
        </div>
      )}
      {success && (
        <div className='mb-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20'>
          <p className='text-green-700 dark:text-green-400'>{success}</p>
        </div>
      )}

      {/* Language Tabs */}
      <div className='mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700'>
        <div className='flex'>
          {languages.map(lang => {
            const status = getTranslationStatus(lang.code);
            const isActive = activeTab === lang.code;
            const flag = localeFlags[lang.code as keyof typeof localeFlags] || '🌐';

            return (
              <button
                key={lang.code}
                type='button'
                onClick={() => setActiveTab(lang.code)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                <span className='text-lg'>{flag}</span>
                <span>{lang.native_name || lang.name}</span>
                {lang.is_default && (
                  <span className='rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-700'>
                    Default
                  </span>
                )}
                <span
                  className={`h-2 w-2 rounded-full ${
                    status === 'complete'
                      ? 'bg-green-500'
                      : status === 'incomplete'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Auto-translate button */}
        {currentLang && !currentLang.is_default && (
          <button
            type='button'
            onClick={() => handleAutoTranslate(activeTab)}
            disabled={translating || loading}
            className='flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 text-sm text-blue-700 hover:bg-blue-200 disabled:opacity-50 dark:bg-blue-900/50 dark:text-blue-400'
          >
            {translating ? (
              <>
                <span className='animate-spin'>⚙️</span>
                Translating...
              </>
            ) : (
              <>
                <span>🤖</span>
                Auto-translate from {defaultLang?.name || 'Spanish'}
              </>
            )}
          </button>
        )}
      </div>

      {/* Translation Fields */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Current Language Form */}
        <div className='space-y-4'>
          <h3 className='flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white'>
            <span className='text-xl'>
              {localeFlags[activeTab as keyof typeof localeFlags] || '🌐'}
            </span>
            {currentLang?.native_name || currentLang?.name}
          </h3>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={formData[activeTab]?.name || ''}
              onChange={e => handleFieldChange(activeTab, 'name', e.target.value)}
              required
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Description
            </label>
            <textarea
              value={formData[activeTab]?.description || ''}
              onChange={e => handleFieldChange(activeTab, 'description', e.target.value)}
              rows={4}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Short Description
            </label>
            <textarea
              value={formData[activeTab]?.short_description || ''}
              onChange={e => handleFieldChange(activeTab, 'short_description', e.target.value)}
              rows={2}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              SEO Title
            </label>
            <input
              type='text'
              value={formData[activeTab]?.seo_title || ''}
              onChange={e => handleFieldChange(activeTab, 'seo_title', e.target.value)}
              maxLength={60}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              SEO Description
            </label>
            <textarea
              value={formData[activeTab]?.seo_description || ''}
              onChange={e => handleFieldChange(activeTab, 'seo_description', e.target.value)}
              maxLength={160}
              rows={2}
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>
        </div>

        {/* Reference (Default Language) */}
        {defaultLang && activeTab !== defaultLang.code && (
          <div className='space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50'>
            <h3 className='flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-400'>
              <span className='text-xl'>
                {localeFlags[defaultLang.code as keyof typeof localeFlags] || '🌐'}
              </span>
              {defaultLang.native_name || defaultLang.name} (Reference)
            </h3>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-500 dark:text-gray-500'>
                Name
              </label>
              <p className='rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                {formData[defaultLang.code]?.name || '(empty)'}
              </p>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-500 dark:text-gray-500'>
                Description
              </label>
              <p className='rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-pre-wrap text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                {formData[defaultLang.code]?.description || '(empty)'}
              </p>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-500 dark:text-gray-500'>
                Short Description
              </label>
              <p className='rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                {formData[defaultLang.code]?.short_description || '(empty)'}
              </p>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-500 dark:text-gray-500'>
                SEO Title
              </label>
              <p className='rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                {formData[defaultLang.code]?.seo_title || '(empty)'}
              </p>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-500 dark:text-gray-500'>
                SEO Description
              </label>
              <p className='rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'>
                {formData[defaultLang.code]?.seo_description || '(empty)'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className='mt-6 flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700'>
        <button
          type='button'
          onClick={() => router.back()}
          className='rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={loading}
          className='flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50'
        >
          {loading ? (
            <>
              <span className='animate-spin'>⚙️</span> Saving...
            </>
          ) : (
            'Save All Translations'
          )}
        </button>
      </div>
    </form>
  );
}
