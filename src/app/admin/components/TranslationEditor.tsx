'use client';

import { useState } from 'react';

import { localeFlags, localeNames, locales } from '@/i18n/config';

interface TranslationField {
  name: string;
  label: string;
  type: 'text' | 'textarea';
  required?: boolean;
  placeholder?: string;
}

interface TranslationData {
  [locale: string]: {
    [field: string]: string;
  };
}

interface TranslationEditorProps {
  fields: TranslationField[];
  translations: TranslationData;
  onChange: (translations: TranslationData) => void;
  onAutoTranslate?: (sourceLocale: string, targetLocale: string) => Promise<void>;
  isLoading?: boolean;
}

export function TranslationEditor({
  fields,
  translations,
  onChange,
  onAutoTranslate,
  isLoading,
}: TranslationEditorProps) {
  const [activeLocale, setActiveLocale] = useState('es');
  const [translating, setTranslating] = useState(false);

  const handleFieldChange = (locale: string, field: string, value: string) => {
    onChange({
      ...translations,
      [locale]: {
        ...translations[locale],
        [field]: value,
      },
    });
  };

  const handleAutoTranslate = async (targetLocale: string) => {
    if (!onAutoTranslate) return;

    setTranslating(true);
    try {
      await onAutoTranslate('es', targetLocale);
    } finally {
      setTranslating(false);
    }
  };

  const getTranslationStatus = (locale: string): 'complete' | 'incomplete' | 'missing' => {
    const localeData = translations[locale];
    if (!localeData) return 'missing';

    const requiredFields = fields.filter(f => f.required);
    const hasAllRequired = requiredFields.every(f => localeData[f.name]?.trim());

    if (hasAllRequired) {
      const allFields = fields.every(f => localeData[f.name]?.trim());
      return allFields ? 'complete' : 'incomplete';
    }

    return 'incomplete';
  };

  return (
    <div className='space-y-4'>
      {/* Language Tabs */}
      <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-700'>
        <div className='flex'>
          {locales.map(locale => {
            const status = getTranslationStatus(locale);
            const isActive = activeLocale === locale;

            return (
              <button
                key={locale}
                type='button'
                onClick={() => setActiveLocale(locale)}
                className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span>{localeFlags[locale as keyof typeof localeFlags]}</span>
                <span>{localeNames[locale as keyof typeof localeNames]}</span>
                <StatusDot status={status} />
              </button>
            );
          })}
        </div>

        {/* Auto-translate button */}
        {activeLocale !== 'es' && onAutoTranslate && (
          <button
            type='button'
            onClick={() => handleAutoTranslate(activeLocale)}
            disabled={translating || isLoading}
            className='flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-200 disabled:opacity-50 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/70'
          >
            {translating ? (
              <>
                <span className='animate-spin'>⚙️</span>
                Translating...
              </>
            ) : (
              <>
                <span>🤖</span>
                Auto-translate from Spanish
              </>
            )}
          </button>
        )}
      </div>

      {/* Fields */}
      <div className='space-y-4'>
        {fields.map(field => (
          <div key={field.name}>
            <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              {field.label}
              {field.required && <span className='ml-1 text-red-500'>*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                value={translations[activeLocale]?.[field.name] || ''}
                onChange={e => handleFieldChange(activeLocale, field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            ) : (
              <input
                type='text'
                value={translations[activeLocale]?.[field.name] || ''}
                onChange={e => handleFieldChange(activeLocale, field.name, e.target.value)}
                placeholder={field.placeholder}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            )}
          </div>
        ))}
      </div>

      {/* Side-by-side comparison for non-default locales */}
      {activeLocale !== 'es' && (
        <div className='mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800'>
          <h4 className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
            <span>🇪🇸</span> Spanish (Original)
          </h4>
          <div className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
            {fields.map(field => (
              <div key={field.name}>
                <span className='font-medium'>{field.label}:</span>{' '}
                <span>{translations['es']?.[field.name] || '(empty)'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusDot({ status }: { status: 'complete' | 'incomplete' | 'missing' }) {
  const colors = {
    complete: 'bg-green-500',
    incomplete: 'bg-yellow-500',
    missing: 'bg-red-500',
  };

  return <span className={`h-2 w-2 rounded-full ${colors[status]}`} />;
}
