'use client';

import { useLocale } from 'next-intl';
import { useEffect } from 'react';

import { defaultLocale, type Locale, localeFlags, localeNames, locales } from '@/i18n/config';
import { usePathname, useRouter } from '@/i18n/routing';

const LOCALE_STORAGE_KEY = 'ZIVAH_PREFERRED_LOCALE';

// Helper to get stored locale preference
function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale;
  }
  return null;
}

// Helper to store locale preference
function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  // Also set cookie for server-side detection (next-intl reads NEXT_LOCALE)
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons' | 'select';
}

export default function LanguageSwitcher({
  className = '',
  variant = 'select',
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  // On mount, check if user has a stored preference different from current locale
  useEffect(() => {
    const storedLocale = getStoredLocale();

    // If user has a stored preference and it's different from current, redirect
    if (storedLocale && storedLocale !== locale) {
      router.replace(pathname, { locale: storedLocale });
    }
    // If no stored preference, save the current locale (default is es)
    else if (!storedLocale) {
      setStoredLocale(defaultLocale);
    }
  }, []); // Only run on mount

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale !== locale) {
      // Save preference to localStorage and cookie
      setStoredLocale(newLocale);
      router.replace(pathname, { locale: newLocale });
    }
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {locales.map(loc => (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              locale === loc
                ? 'bg-accent text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            aria-label={`Switch to ${localeNames[loc]}`}
            aria-current={locale === loc ? 'true' : undefined}
          >
            <span>{localeFlags[loc]}</span>
            <span className='hidden sm:inline'>{loc.toUpperCase()}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={locale}
          onChange={e => handleLocaleChange(e.target.value as Locale)}
          className='focus:ring-accent cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm font-medium text-gray-900 focus:border-transparent focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
          aria-label='Select language'
        >
          {locales.map(loc => (
            <option
              key={loc}
              value={loc}
            >
              {localeFlags[loc]} {localeNames[loc]}
            </option>
          ))}
        </select>
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300'>
          <svg
            className='h-4 w-4 fill-current'
            viewBox='0 0 20 20'
          >
            <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
          </svg>
        </div>
      </div>
    );
  }

  // Default: select variant (compact)
  return (
    <select
      value={locale}
      onChange={e => handleLocaleChange(e.target.value as Locale)}
      className={`focus:ring-accent cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 ${className}`}
      aria-label='Select language'
    >
      {locales.map(loc => (
        <option
          key={loc}
          value={loc}
        >
          {localeFlags[loc]} {loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
