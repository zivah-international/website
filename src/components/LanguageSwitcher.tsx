'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { defaultLocale, type Locale, locales } from '@/i18n/config';
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
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('nav');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally runs only on mount to apply stored preference once

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale !== locale) {
      // Save preference to localStorage and cookie
      setStoredLocale(newLocale);
      router.replace(pathname, { locale: newLocale });
    }
  };

  return (
    <select
      value={locale}
      onChange={e => handleLocaleChange(e.target.value as Locale)}
      className={`h-11 cursor-pointer rounded-[2px] border border-current/25 bg-transparent px-3 text-sm font-medium text-current focus:outline-none ${className}`}
      aria-label={t('language')}
    >
      {locales.map(loc => (
        <option
          key={loc}
          value={loc}
        >
          {loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
