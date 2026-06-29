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
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
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
          className='focus:ring-accent border-border bg-background text-foreground cursor-pointer appearance-none rounded-lg border px-4 py-2 pr-8 text-sm font-medium focus:border-transparent focus:ring-2 focus:outline-none'
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
        <div className='text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
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
      className={`focus:ring-accent border-border bg-background text-foreground cursor-pointer rounded-lg border px-3 py-1 text-sm focus:ring-2 focus:outline-none ${className}`}
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
