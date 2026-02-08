// Internationalization Configuration for ZIVAH International

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

// Locale display names
export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

// Locale flags for UI
export const localeFlags: Record<Locale, string> = {
  es: '🇪🇨',
  en: '🇺🇸',
};

// Full locale codes for SEO
export const localeFullCodes: Record<Locale, string> = {
  es: 'es-ES',
  en: 'en-US',
};

// OpenGraph locale codes
export const ogLocales: Record<Locale, string> = {
  es: 'es_ES',
  en: 'en_US',
};

// Check if a locale is valid
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
