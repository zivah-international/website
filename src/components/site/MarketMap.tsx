import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { MARKETS } from '@/lib/public-data';

/**
 * Local, monochrome world map. Source: Wikimedia Commons,
 * "World map - low resolution.svg" (public domain).
 * The dots carry the commercial meaning; the map itself is decorative.
 */
export default async function MarketMap() {
  const t = await getTranslations('markets.map');

  return (
    <div
      role='img'
      aria-label={t('ariaLabel')}
      className='relative aspect-[950/620] w-full'
    >
      <Image
        src='/assets/images/world-map.svg'
        alt=''
        fill
        sizes='(min-width: 1200px) 1120px, 100vw'
        className='object-contain opacity-20 grayscale dark:invert'
      />

      {MARKETS.map(market => {
        const active = market.status === 'active';

        return (
          <span
            key={market.code}
            className='absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5'
            style={{ left: `${market.x}%`, top: `${market.y}%` }}
          >
            <span
              className={
                active
                  ? 'block size-2 rounded-full bg-accent'
                  : 'block size-2 rounded-full border border-accent bg-transparent'
              }
            />
            <span className='hidden text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase lg:block'>
              {market.code}
            </span>
          </span>
        );
      })}
    </div>
  );
}
