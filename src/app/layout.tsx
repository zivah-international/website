import './globals.css';

import type { Metadata } from 'next';
import Script from 'next/script';
import { getLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'ZIVAH International S.A.',
  description: 'Premium Ecuadorian Products Exporters',
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
        className='min-h-screen bg-background font-sans text-foreground antialiased transition-colors duration-300'
        suppressHydrationWarning
      >
        <Script
          id='theme-init'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var s=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if((t||s)==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
