import { getTranslations } from 'next-intl/server';

import CTABand from '@/components/site/CTABand';
import MarketMap from '@/components/site/MarketMap';
import PageHeader from '@/components/site/PageHeader';
import SectionHeader from '@/components/site/SectionHeader';
import { MARKETS } from '@/lib/public-data';

interface Props {
  params: Promise<{ locale: string }>;
}

type EvidenceRow = { title: string; description: string };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'markets' });
  return {
    title: `${t('title')} | ZIVAH International`,
    description: t('description'),
  };
}

export default async function MarketsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'markets' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const rows = t.raw('evidence.rows') as EvidenceRow[];

  return (
    <>
      <PageHeader
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('markets') }]}
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      />

      <section
        aria-label={t('map.ariaLabel')}
        className='bg-background pb-16 lg:pb-24'
      >
        <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
          <MarketMap />

          <ul className='mt-12 border-t border-border'>
            {MARKETS.map(market => {
              const active = market.status === 'active';

              return (
                <li
                  key={market.code}
                  data-testid='market-row'
                  className='grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-border py-4'
                >
                  <span className='flex size-9 items-center justify-center border border-border text-[11px] font-semibold tracking-[0.12em] text-foreground'>
                    {market.code}
                  </span>
                  <div className='min-w-0'>
                    <div className='flex flex-wrap items-baseline gap-x-2'>
                      <p className='text-[15px] font-medium text-foreground'>
                        {t(`list.${market.code}.country`)}
                      </p>
                      <p className='text-[13px] text-muted-foreground'>
                        {t(`list.${market.code}.hub`)}
                      </p>
                    </div>
                    <p className='mt-0.5 text-[13px] leading-relaxed text-muted-foreground'>
                      {t(`list.${market.code}.note`)}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold tracking-[0.14em] uppercase ${
                      active ? 'text-accent' : 'text-muted-foreground'
                    }`}
                  >
                    {t(`status.${market.status}`)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby='markets-evidence-title'
        className='border-y border-border bg-surface py-16 lg:py-24'
      >
        <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
          <SectionHeader
            eyebrow={t('evidence.eyebrow')}
            title={t('evidence.title')}
            lead={t('evidence.lead')}
          />

          <ul className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4'>
            {rows.map(row => (
              <li
                key={row.title}
                className='border-t border-border pt-6'
              >
                <h3 className='text-xl leading-snug text-foreground'>{row.title}</h3>
                <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                  {row.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTABand
        title={t('cta.title')}
        body={t('cta.body')}
        action={{ label: t('cta.action'), href: '/quote' }}
      />
    </>
  );
}
