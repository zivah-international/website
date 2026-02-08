'use client';

import { useState } from 'react';

import { localeFlags, localeNames, locales } from '@/i18n/config';

interface LanguageTabsProps {
  activeLocale: string;
  onLocaleChange: (locale: string) => void;
  translationStatus?: Record<string, 'complete' | 'incomplete' | 'auto' | 'missing'>;
}

export function LanguageTabs({
  activeLocale,
  onLocaleChange,
  translationStatus,
}: LanguageTabsProps) {
  return (
    <div className='flex border-b border-gray-200 dark:border-gray-700'>
      {locales.map(locale => {
        const status = translationStatus?.[locale];
        const isActive = activeLocale === locale;

        return (
          <button
            key={locale}
            type='button'
            onClick={() => onLocaleChange(locale)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'border-green-500 text-green-600 dark:text-green-400'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <span>{localeFlags[locale as keyof typeof localeFlags]}</span>
            <span>{localeNames[locale as keyof typeof localeNames]}</span>
            {status && <TranslationStatusBadge status={status} />}
          </button>
        );
      })}
    </div>
  );
}

interface TranslationStatusBadgeProps {
  status: 'complete' | 'incomplete' | 'auto' | 'missing';
}

export function TranslationStatusBadge({ status }: TranslationStatusBadgeProps) {
  const styles = {
    complete: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400',
    incomplete: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
    auto: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400',
    missing: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400',
  };

  const labels = {
    complete: '✓',
    incomplete: '…',
    auto: '🤖',
    missing: '✗',
  };

  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

interface UseLanguageTabsOptions {
  defaultLocale?: string;
}

export function useLanguageTabs(options: UseLanguageTabsOptions = {}) {
  const [activeLocale, setActiveLocale] = useState(options.defaultLocale || 'es');

  return {
    activeLocale,
    setActiveLocale,
  };
}
