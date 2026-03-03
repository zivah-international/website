import './globals.css';

import type { Metadata } from 'next';

// Root layout - This is a pass-through layout
// The main app layout with locale support is in [locale]/layout.tsx

export const metadata: Metadata = {
  title: 'ZIVAH International S.A.',
  description: 'Premium Ecuadorian Products Exporters',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
