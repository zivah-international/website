import './globals.css';

import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import Script from 'next/script';
import { getLocale } from 'next-intl/server';

// Loaded in the root layout on purpose: Radix portals (sheet, dropdown, dialog,
// toasts) mount on <body>, outside the `.public-site` wrapper in the locale
// layout, so the CSS variables must be defined on the body itself.
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'ZIVAH International — Ecuadorian seafood and aquaculture',
  description: 'Shrimp, post-larvae and Pacific tuna from Ecuador.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior='smooth'
    >
      <body
        className={`${inter.variable} ${newsreader.variable} min-h-screen bg-background font-sans text-foreground antialiased transition-colors duration-300`}
        suppressHydrationWarning
      >
        <Script
          id='theme-init'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var s=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var r=(t==='light'||t==='dark')?t:s;document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(r);document.documentElement.style.colorScheme=r;}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
