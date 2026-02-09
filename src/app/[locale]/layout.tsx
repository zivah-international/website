import '../globals.css';

import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import Analytics from '@/components/Analytics';
import BusinessIntelligence from '@/components/BusinessIntelligence';
import ClientThemeProvider from '@/components/ClientThemeProvider';
import CookieConsent from '@/components/CookieConsent';
import { ErrorBoundary, NetworkStatus } from '@/components/ErrorHandling';
import ServiceWorkerRegistration from '@/components/ServiceWorker';
import StructuredData from '@/components/StructuredData';
import WebVitals from '@/components/WebVitals';
import { type Locale, localeFullCodes, locales, localeVariants, ogLocales } from '@/i18n/config';
import { routing } from '@/i18n/routing';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1419' },
  ],
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locale as Locale;
  const baseUrl = 'https://zivahinternational.com';
  const localePath = validLocale === 'es' ? '' : `/${validLocale}`;

  // Localized content
  const content: Record<Locale, { title: string; description: string; keywords: string }> = {
    es: {
      title:
        'ZIVAH International S.A. - Exportadores de Productos Ecuatorianos Premium | Ecuador hacia el Mundo',
      description:
        'ZIVAH International S.A. - Exportadores líderes de productos ecuatorianos premium desde Ecuador hacia el mundo. Frutas tropicales, camarón, café arábica y larvas de acuicultura. Sede en Samborondón, Guayas con oficina en Miami.',
      keywords:
        'exportación ecuador, frutas tropicales, camarón ecuatoriano, larvas acuicultura, cafe arabica, productos marinos, miami exportadores, exportar desde ecuador, comercio internacional ecuador',
    },
    en: {
      title:
        'ZIVAH International S.A. - Premium Ecuadorian Products Exporters | Ecuador to the World',
      description:
        'ZIVAH International S.A. - Leading exporters of premium Ecuadorian products from Ecuador to the world. Tropical fruits, shrimp, arabica coffee and aquaculture larvae. Headquartered in Samborondón, Guayas with Miami office.',
      keywords:
        'ecuador export, tropical fruits, ecuadorian shrimp, aquaculture larvae, arabica coffee, seafood products, miami exporters, ecuador trade, international commerce',
    },
  };

  const { title, description, keywords } = content[validLocale] || content.es;

  // Generate all hreflang alternates
  const alternateLanguages: Record<string, string> = {
    'x-default': baseUrl,
  };

  // Add primary locale URLs
  locales.forEach(l => {
    const lPath = l === 'es' ? '' : `/${l}`;
    alternateLanguages[localeFullCodes[l]] = `${baseUrl}${lPath}`;

    // Add variant locales
    localeVariants[l].forEach(variant => {
      alternateLanguages[variant] = `${baseUrl}${lPath}`;
    });
  });

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'ZIVAH International S.A.', url: baseUrl }],
    creator: 'ZIVAH International S.A.',
    publisher: 'ZIVAH International S.A.',
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}${localePath}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: 'website',
      locale: ogLocales[validLocale],
      alternateLocale: locales.filter(l => l !== validLocale).map(l => ogLocales[l]),
      url: `${baseUrl}${localePath}`,
      siteName: 'ZIVAH International S.A.',
      title,
      description,
      images: [
        {
          url: `${baseUrl}/assets/images/zivah-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'ZIVAH International - Premium Ecuadorian Products',
          type: 'image/jpeg',
        },
        {
          url: `${baseUrl}/assets/images/zivah-og-square.jpg`,
          width: 600,
          height: 600,
          alt: 'ZIVAH International Logo',
          type: 'image/jpeg',
        },
      ],
      countryName: 'Ecuador',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ZivahIntl',
      creator: '@ZivahIntl',
      title,
      description,
      images: {
        url: `${baseUrl}/assets/images/zivah-twitter-image.jpg`,
        alt: 'ZIVAH International - Premium Ecuadorian Products',
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
      other: {
        'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
        'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
        'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION || '',
      },
    },
    category: 'business',
    classification: 'Export, Food & Beverage, Agriculture, B2B',
    other: {
      // Geo-targeting for local SEO
      'geo.region': 'EC-G',
      'geo.placename': 'Samborondón, Guayas, Ecuador',
      'geo.position': '-2.1057;-79.8890',
      ICBM: '-2.1057, -79.8890',
      // Business information
      'business:contact_data:street_address': 'Casa Matriz Mz 10 S L 31, Samborondón',
      'business:contact_data:locality': 'Samborondón',
      'business:contact_data:region': 'Guayas',
      'business:contact_data:postal_code': '092301',
      'business:contact_data:country_name': 'Ecuador',
      'business:contact_data:email': 'info@zivahinternational.com',
      'business:contact_data:phone_number': '+593999002893',
      'business:contact_data:website': baseUrl,
      // Additional SEO tags
      'og:email': 'info@zivahinternational.com',
      'og:phone_number': '+593999002893',
      'og:fax_number': '+593999002893',
      'og:latitude': '-2.1057',
      'og:longitude': '-79.8890',
      'og:street-address': 'Casa Matriz Mz 10 S L 31',
      'og:locality': 'Samborondón',
      'og:region': 'Guayas',
      'og:postal-code': '092301',
      'og:country-name': 'Ecuador',
      // Industry-specific
      'product:brand': 'ZIVAH International',
      'product:availability': 'in stock',
      'product:condition': 'new',
      // Dublin Core metadata
      'DC.title': title,
      'DC.creator': 'ZIVAH International S.A.',
      'DC.subject': keywords,
      'DC.description': description,
      'DC.publisher': 'ZIVAH International S.A.',
      'DC.contributor': 'ZIVAH International S.A.',
      'DC.date': new Date().toISOString(),
      'DC.type': 'Text',
      'DC.format': 'text/html',
      'DC.identifier': `${baseUrl}${localePath}`,
      'DC.language': validLocale,
      'DC.coverage': 'Global',
      'DC.rights': '© 2024 ZIVAH International S.A. All rights reserved.',
    },
    metadataBase: new URL(baseUrl),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/assets/images/icons/favicon.ico', sizes: 'any' },
        { url: '/assets/images/icons/favicon.svg', type: 'image/svg+xml' },
        { url: '/assets/images/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/assets/images/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/assets/images/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      ],
      apple: [
        { url: '/assets/images/icons/apple-icon-180x180.png', sizes: '180x180' },
        { url: '/assets/images/icons/apple-icon-152x152.png', sizes: '152x152' },
        { url: '/assets/images/icons/apple-icon-144x144.png', sizes: '144x144' },
        { url: '/assets/images/icons/apple-icon-120x120.png', sizes: '120x120' },
        { url: '/assets/images/icons/apple-icon-114x114.png', sizes: '114x114' },
        { url: '/assets/images/icons/apple-icon-76x76.png', sizes: '76x76' },
        { url: '/assets/images/icons/apple-icon-72x72.png', sizes: '72x72' },
        { url: '/assets/images/icons/apple-icon-60x60.png', sizes: '60x60' },
        { url: '/assets/images/icons/apple-icon-57x57.png', sizes: '57x57' },
      ],
      other: [
        { rel: 'icon', url: '/assets/images/icons/web-app-manifest-512x512.png', sizes: '512x512' },
        { rel: 'icon', url: '/assets/images/icons/web-app-manifest-192x192.png', sizes: '192x192' },
        { rel: 'icon', url: '/assets/images/icons/android-icon-192x192.png', sizes: '192x192' },
        { rel: 'icon', url: '/assets/images/icons/android-icon-144x144.png', sizes: '144x144' },
        { rel: 'icon', url: '/assets/images/icons/android-icon-96x96.png', sizes: '96x96' },
        { rel: 'icon', url: '/assets/images/icons/android-icon-72x72.png', sizes: '72x72' },
        { rel: 'icon', url: '/assets/images/icons/android-icon-48x48.png', sizes: '48x48' },
        { rel: 'icon', url: '/assets/images/icons/android-icon-36x36.png', sizes: '36x36' },
      ],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'ZIVAH International',
    },
    applicationName: 'ZIVAH International S.A.',
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <meta
          name='msapplication-TileColor'
          content='#ff6347'
        />
        <meta
          name='msapplication-TileImage'
          content='/assets/images/icons/ms-icon-144x144.png'
        />
        <meta
          name='msapplication-config'
          content='/assets/images/icons/browserconfig.xml'
        />
        <meta
          name='theme-color'
          content='#ffffff'
          media='(prefers-color-scheme: light)'
        />
        <meta
          name='theme-color'
          content='#0f1419'
          media='(prefers-color-scheme: dark)'
        />
        <link
          rel='preconnect'
          href='https://fonts.googleapis.com'
        />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          rel='preconnect'
          href='https://www.google-analytics.com'
        />
        <link
          rel='preconnect'
          href='https://www.googletagmanager.com'
        />
        <link
          rel='dns-prefetch'
          href='//fonts.googleapis.com'
        />
        <link
          rel='dns-prefetch'
          href='//www.google-analytics.com'
        />
        {/* Google Analytics loaded via Analytics component */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                const savedTheme = localStorage.getItem('theme');
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const initialTheme = savedTheme || systemTheme;
                if (initialTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `,
          }}
        />
        {/* Alternate language links for SEO - All supported locales */}
        <link
          rel='alternate'
          hrefLang='es'
          href='https://zivahinternational.com/'
        />
        <link
          rel='alternate'
          hrefLang='es-EC'
          href='https://zivahinternational.com/'
        />
        <link
          rel='alternate'
          hrefLang='es-ES'
          href='https://zivahinternational.com/'
        />
        <link
          rel='alternate'
          hrefLang='es-MX'
          href='https://zivahinternational.com/'
        />
        <link
          rel='alternate'
          hrefLang='es-AR'
          href='https://zivahinternational.com/'
        />
        <link
          rel='alternate'
          hrefLang='es-CO'
          href='https://zivahinternational.com/'
        />
        <link
          rel='alternate'
          hrefLang='es-PE'
          href='https://zivahinternational.com/'
        />
        <link
          rel='alternate'
          hrefLang='es-CL'
          href='https://zivahinternational.com/'
        />
        <link
          rel='alternate'
          hrefLang='en'
          href='https://zivahinternational.com/en'
        />
        <link
          rel='alternate'
          hrefLang='en-US'
          href='https://zivahinternational.com/en'
        />
        <link
          rel='alternate'
          hrefLang='en-GB'
          href='https://zivahinternational.com/en'
        />
        <link
          rel='alternate'
          hrefLang='en-CA'
          href='https://zivahinternational.com/en'
        />
        <link
          rel='alternate'
          hrefLang='en-AU'
          href='https://zivahinternational.com/en'
        />
        <link
          rel='alternate'
          hrefLang='x-default'
          href='https://zivahinternational.com/'
        />
      </head>
      <body
        className='bg-background text-foreground min-h-screen font-sans antialiased transition-colors duration-300'
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <ErrorBoundary>
            <ClientThemeProvider>
              {/* Structured Data for SEO */}
              <StructuredData locale={locale} />
              <Suspense fallback={null}>
                <Analytics />
              </Suspense>
              <BusinessIntelligence />
              <ServiceWorkerRegistration />
              <WebVitals />
              {children}
            </ClientThemeProvider>
          </ErrorBoundary>
          <CookieConsent />
          <NetworkStatus />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
