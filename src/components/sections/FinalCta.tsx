import { getTranslations } from 'next-intl/server';

import CTABand from '@/components/site/CTABand';

export default async function FinalCta() {
  const t = await getTranslations('home.finalCta');

  return (
    <CTABand
      title={t('title')}
      body={t('body')}
      action={{ label: t('primary'), href: '/quote' }}
      secondary={
        <p className='flex flex-col gap-2 sm:flex-row sm:gap-6 lg:justify-end'>
          <a
            href='mailto:sales@zivahinternational.com'
            className='prose-link transition-colors hover:text-primary-foreground'
          >
            {t('email')}
          </a>
          <a
            href='https://wa.me/593999002893'
            className='prose-link transition-colors hover:text-primary-foreground'
          >
            {t('whatsapp')}
          </a>
        </p>
      }
    />
  );
}
