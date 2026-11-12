import { getLocale } from 'next-intl/server';

export default async function LegalLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <div className='container mx-auto max-w-[720px] px-4 py-28 sm:px-6'>
      {locale === 'en' && (
        <p className='mb-8 border-l-2 border-accent pl-4 text-sm text-muted-foreground'>
          This legal document is currently available in Spanish. For an English version, contact
          sales@zivahinternational.com.
        </p>
      )}
      {children}
    </div>
  );
}
