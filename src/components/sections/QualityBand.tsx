import { getTranslations } from 'next-intl/server';

import CertificationMark from '@/components/site/CertificationMark';
import { Link } from '@/i18n/routing';
import { CERTIFICATIONS } from '@/lib/public-data';

const CERTIFICATION_DESCRIPTIONS = ['bap', 'haccp', 'brc', 'msc'] as const;

export default async function QualityBand() {
  const t = await getTranslations('home.quality');

  return (
    <section
      data-testid='quality-band'
      aria-labelledby='quality-band-title'
      className='bg-primary py-16 text-primary-foreground lg:py-24'
    >
      <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
        <div className='grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12'>
          <h2
            id='quality-band-title'
            className='max-w-[20ch] text-[clamp(2rem,3.6vw,2.75rem)] text-primary-foreground lg:col-span-7'
          >
            {t('title')}
          </h2>
          <p className='max-w-[52ch] text-[17px] leading-relaxed text-primary-foreground/75 lg:col-span-5'>
            {t('lead')}
          </p>
        </div>

        <div className='mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {CERTIFICATIONS.map((certification, index) => (
            <CertificationMark
              key={certification.code}
              code={certification.code}
              name={certification.name}
              description={t(`certifications.${CERTIFICATION_DESCRIPTIONS[index]}`)}
              className='border-primary-foreground/25 text-primary-foreground'
            />
          ))}
        </div>

        <div className='mt-10 flex flex-col gap-4 border-t border-primary-foreground/20 pt-6 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-[13px] text-primary-foreground/60'>{t('note')}</p>
          <Link
            href='/quality'
            className='prose-link text-[13px] font-semibold text-[#F3B39C] transition-colors hover:text-[#FFD5C6]'
          >
            {t('link')}
          </Link>
        </div>
      </div>
    </section>
  );
}
