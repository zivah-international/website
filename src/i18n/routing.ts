import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

import { defaultLocale, locales } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // 'as-needed' means: no prefix for default locale (es), prefix for others (/en)
  localePrefix: 'as-needed',
});

// Lightweight wrappers around Next.js' navigation APIs
// that will automatically handle the locale for you
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
