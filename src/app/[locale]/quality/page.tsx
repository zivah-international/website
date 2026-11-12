import { getTranslations } from 'next-intl/server';

import CTABand from '@/components/site/CTABand';
import EvidenceBar from '@/components/site/EvidenceBar';
import PageHeader from '@/components/site/PageHeader';
import SectionHeader from '@/components/site/SectionHeader';
import { CERTIFICATIONS } from '@/lib/public-data';

interface Props {
  params: Promise<{ locale: string }>;
}

type QualityStep = { title: string; description: string };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quality' });
  return {
    title: `${t('title')} | ZIVAH International`,
    description: t('description'),
  };
}

export default async function QualityPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'quality' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const steps = t.raw('process.steps') as QualityStep[];

  return (
    <>
      <PageHeader
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('quality') }]}
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <section
        aria-labelledby='certifications-title'
        className='bg-background pb-16 lg:pb-24'
      >
        <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
          <h2
            id='certifications-title'
            className='sr-only'
          >
            {t('certificationsTitle')}
          </h2>

          <ul className='border-t border-border'>
            {CERTIFICATIONS.map(certification => (
              <li
                key={certification.code}
                data-testid='certification-row'
                className='grid gap-4 border-b border-border py-6 sm:grid-cols-[96px_1fr] sm:items-baseline sm:gap-8 lg:grid-cols-[96px_1.1fr_1fr]'
              >
                <span className='flex h-10 w-24 items-center justify-center border border-border text-[11px] font-semibold tracking-[0.18em] text-foreground uppercase'>
                  {certification.code}
                </span>
                <h3 className='font-serif text-xl leading-snug text-foreground'>
                  {certification.name}
                </h3>
                <div>
                  <p className='text-[15px] leading-relaxed text-muted-foreground'>
                    {t(`certifications.${certification.code.toLowerCase()}`)}
                  </p>
                  <p className='mt-2 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase'>
                    {t(`scope.${certification.scope}`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className='mt-4 text-[13px] text-muted-foreground'>{t('note')}</p>
        </div>
      </section>

      <section
        aria-labelledby='quality-process-title'
        className='border-y border-border bg-surface py-16 lg:py-24'
      >
        <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
          <SectionHeader
            eyebrow={t('process.eyebrow')}
            title={t('process.title')}
            lead={t('process.lead')}
          />

          <ol className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4'>
            {steps.map((step, index) => (
              <li
                key={step.title}
                data-testid='quality-step'
                className='border-t border-border pt-6'
              >
                <span className='text-[11px] font-semibold tracking-[0.18em] text-accent uppercase'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className='mt-3 text-xl leading-snug text-foreground'>{step.title}</h3>
                <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <EvidenceBar />

      <CTABand
        title={t('cta.title')}
        body={t('cta.body')}
        action={{ label: t('cta.action'), href: '/quote' }}
      />
    </>
  );
}
