// Internationalization Configuration for ZIVAH International
// Optimized for maximum global SEO reach

// Primary languages for full content support
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

// Locale display names (in native language)
export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

// Locale flags for UI (using regional variants)
export const localeFlags: Record<Locale, string> = {
  es: '🇪🇨', // Ecuador flag for Spanish (origin country)
  en: '🇺🇸', // USA flag for English
};

// Full locale codes for SEO (BCP 47 format)
export const localeFullCodes: Record<Locale, string> = {
  es: 'es-EC', // Spanish (Ecuador) - primary
  en: 'en-US', // English (US) - primary market
};

// Additional locale variants for SEO hreflang
export const localeVariants: Record<Locale, string[]> = {
  es: ['es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-PE', 'es-CL', 'es-EC'],
  en: ['en-US', 'en-GB', 'en-CA', 'en-AU', 'en-NZ'],
};

// OpenGraph locale codes
export const ogLocales: Record<Locale, string> = {
  es: 'es_ES',
  en: 'en_US',
};

// Language direction (LTR/RTL)
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  es: 'ltr',
  en: 'ltr',
};

// ISO 639-1 codes for search engines
export const iso639Codes: Record<Locale, string> = {
  es: 'es',
  en: 'en',
};

// Target markets/countries for each locale (for geo-targeting)
export const localeTargetMarkets: Record<Locale, string[]> = {
  es: [
    'EC',
    'ES',
    'MX',
    'AR',
    'CO',
    'PE',
    'CL',
    'VE',
    'UY',
    'PY',
    'BO',
    'CR',
    'PA',
    'GT',
    'HN',
    'SV',
    'NI',
    'CU',
    'DO',
    'PR',
  ],
  en: ['US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'SG', 'HK', 'PH', 'IN', 'ZA', 'KE', 'NG'],
};

// Currency preferences per locale (for e-commerce SEO)
export const localeCurrencies: Record<Locale, string> = {
  es: 'USD', // Ecuador uses USD
  en: 'USD',
};

// Check if a locale is valid
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// Get all hreflang links for SEO
export function getHreflangLinks(currentPath: string = ''): { locale: string; href: string }[] {
  const baseUrl = 'https://zivahinternational.com';
  const links: { locale: string; href: string }[] = [];

  // Add x-default (Spanish as default)
  links.push({ locale: 'x-default', href: `${baseUrl}${currentPath}` });

  // Add all locales with their variants
  locales.forEach(locale => {
    const localePath = locale === defaultLocale ? '' : `/${locale}`;
    const primaryHref = `${baseUrl}${localePath}${currentPath}`;

    // Add primary locale
    links.push({ locale: localeFullCodes[locale], href: primaryHref });

    // Add variant locales pointing to the same content
    localeVariants[locale].forEach(variant => {
      if (variant !== localeFullCodes[locale]) {
        links.push({ locale: variant, href: primaryHref });
      }
    });
  });

  return links;
}

// Get locale from country code (for geo-detection)
export function getLocaleFromCountry(countryCode: string): Locale {
  for (const [locale, countries] of Object.entries(localeTargetMarkets)) {
    if (countries.includes(countryCode.toUpperCase())) {
      return locale as Locale;
    }
  }
  return defaultLocale;
}
