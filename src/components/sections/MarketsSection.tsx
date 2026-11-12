import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import { MARKETS } from '@/lib/public-data';

export default async function MarketsSection() {
  const t = await getTranslations('home.markets');

  return (
    <section
      aria-labelledby='markets-title'
      className='bg-background py-16 lg:py-24'
    >
      <div className='mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <h2
            id='markets-title'
            className='max-w-[18ch] text-[clamp(2rem,3.6vw,2.75rem)] text-foreground'
          >
            {t('title')}
          </h2>
          <Link
            href='/markets'
            className='prose-link text-[13px] font-semibold text-foreground transition-colors hover:text-accent'
          >
            {t('link')}
          </Link>
        </div>

        <div className='mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12'>
          {/* Decorative route diagram — the list carries the information. */}
          <div
            aria-hidden='true'
            className='order-2 text-border lg:order-1 lg:col-span-5'
          >
            <svg
              viewBox='0 0 100 60'
              className='w-full'
              role='presentation'
              focusable='false'
            >
              {MARKETS.map(market => (
                <line
                  key={`route-${market.code}`}
                  x1='24'
                  y1='52'
                  x2={market.x}
                  y2={market.y}
                  stroke='currentColor'
                  strokeWidth='0.3'
                  strokeDasharray='1.5 1.5'
                />
              ))}
              <circle
                cx='24'
                cy='52'
                r='1.6'
                className='fill-accent'
              />
              {MARKETS.map(market => (
                <circle
                  key={`dot-${market.code}`}
                  cx={market.x}
                  cy={market.y}
                  r={market.status === 'active' ? 1.5 : 1.1}
                  className={
                    market.status === 'active' ? 'fill-accent' : 'fill-none stroke-current'
                  }
                  strokeWidth='0.4'
                />
              ))}
            </svg>
          </div>

          <ul className='order-1 border-t border-border lg:order-2 lg:col-span-7'>
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
      </div>
    </section>
  );
}
