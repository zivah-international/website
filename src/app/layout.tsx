import './globals.css';

import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { Suspense } from 'react';

import Analytics from '@/components/Analytics';
import BusinessIntelligence from '@/components/BusinessIntelligence';
import ClientThemeProvider from '@/components/ClientThemeProvider';
import CookieConsent from '@/components/CookieConsent';
import { ErrorBoundary, NetworkStatus } from '@/components/ErrorHandling';
import ServiceWorkerRegistration from '@/components/ServiceWorker';
import WebVitals from '@/components/WebVitals';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title:
    'ZIVAH International S.A. - Exportadores de Productos Ecuatorianos Premium | Ecuador hacia el Mundo',
  description:
    'ZIVAH International S.A. - Exportadores líderes de productos ecuatorianos premium desde Ecuador hacia el mundo. Con sede principal en Samborondón, Guayas y oficina de distribución en Miami. Frutas tropicales, mariscos, café, camarón, larvas de acuicultura y cultivo de árboles frutales. Más de 4 años conectando Ecuador con el mundo.',
  keywords:
    'exportación ecuador, frutas tropicales, camarón ecuatoriano, larvas acuicultura, cafe arabica, productos marinos, miami exportadores, Samborondón cultivos, arboles frutales, nueces ecuador, ZIVAH International, productos premium ecuador, exportadores miami, acuicultura ecuador, camarón vannamei, frutas exóticas, café altura, certificación internacional, BAP, HACCP, BRC, GlobalGAP',
  authors: [{ name: 'ZIVAH International S.A.' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://zivahinternational.com/',
    languages: {
      'es-ES': 'https://zivahinternational.com/',
      'en-US': 'https://zivahinternational.com/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_US'],
    url: 'https://zivahinternational.com/',
    siteName: 'ZIVAH International S.A.',
    title: 'ZIVAH International S.A. - Exportadores de Productos Ecuatorianos Premium',
    description:
      'Exportadores líderes de productos ecuatorianos premium desde Ecuador hacia el mundo. Con sede principal en Samborondón, Guayas. Frutas tropicales, mariscos, café, camarón, larvas de acuicultura y cultivo de árboles frutales con certificación internacional.',
    images: [
      {
        url: 'https://zivahinternational.com/assets/images/zivah-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ZIVAH International - Productos Ecuatorianos Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ZivahIntl',
    creator: '@ZivahIntl',
    title: 'ZIVAH International S.A. - Exportadores de Productos Ecuatorianos Premium',
    description:
      'Exportadores líderes de productos ecuatorianos premium desde Ecuador hacia el mundo. Con sede principal en Samborondón, Guayas. Frutas tropicales, mariscos, café, camarón, larvas de acuicultura y cultivo de árboles frutales.',
    images: ['https://zivahinternational.com/assets/images/zivah-twitter-image.jpg'],
  },
  other: {
    'geo.region': 'EC-G',
    'geo.placename': 'Samborondón, Guayas, Ecuador',
    'geo.position': '-2.1057;-79.8890',
    ICBM: '-2.1057, -79.8890',
    'business:contact_data:street_address': 'Casa Matriz Mz 10 S L 31, Samborondón',
    'business:contact_data:locality': 'Samborondón',
    'business:contact_data:region': 'Guayas',
    'business:contact_data:postal_code': '092301',
    'business:contact_data:country_name': 'Ecuador',
    'business:contact_data:email': 'info@zivahinternational.com',
    'business:contact_data:phone_number': '+593999002893',
    'business:contact_data:website': 'https://zivahinternational.com',
  },
  metadataBase: new URL('https://zivahinternational.com'),
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
      {
        url: '/assets/images/icons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/assets/images/icons/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/assets/images/icons/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
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
      {
        rel: 'icon',
        url: '/assets/images/icons/web-app-manifest-512x512.png',
        sizes: '512x512',
      },
      {
        rel: 'icon',
        url: '/assets/images/icons/web-app-manifest-192x192.png',
        sizes: '192x192',
      },
      {
        rel: 'icon',
        url: '/assets/images/icons/android-icon-192x192.png',
        sizes: '192x192',
      },
      {
        rel: 'icon',
        url: '/assets/images/icons/android-icon-144x144.png',
        sizes: '144x144',
      },
      {
        rel: 'icon',
        url: '/assets/images/icons/android-icon-96x96.png',
        sizes: '96x96',
      },
      {
        rel: 'icon',
        url: '/assets/images/icons/android-icon-72x72.png',
        sizes: '72x72',
      },
      {
        rel: 'icon',
        url: '/assets/images/icons/android-icon-48x48.png',
        sizes: '48x48',
      },
      {
        rel: 'icon',
        url: '/assets/images/icons/android-icon-36x36.png',
        sizes: '36x36',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ZIVAH International',
  },
  applicationName: 'ZIVAH International S.A.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='es'
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
        {/* Google Analytics - Production Only */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                // Prevent flash of wrong theme by setting initial theme immediately
                const savedTheme = localStorage.getItem('theme');
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const initialTheme = savedTheme || systemTheme;
                if (initialTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {
                // Silently fail - ThemeProvider will handle it
              }
            })();
          `,
          }}
        />
      </head>
      <body
        className='bg-background text-foreground min-h-screen font-sans antialiased transition-colors duration-300'
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ClientThemeProvider>
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
      </body>
    </html>
  );
}
