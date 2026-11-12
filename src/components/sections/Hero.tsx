import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export default async function Hero() {
  const t = await getTranslations('home');

  return (
    <section
      data-testid='hero'
      aria-labelledby='home-title'
      className='relative flex h-[72svh] min-h-[560px] items-center overflow-hidden lg:h-auto lg:min-h-[700px]'
    >
      <Image
        src='/assets/images/photos/hero-marine.jpg'
        alt={t('hero.imageAlt')}
        fill
        priority
        sizes='100vw'
        className='object-cover'
      />
      {/* Navy scrim + left-to-right gradient: copy stays legible without flattening the photo */}
      <div
        aria-hidden='true'
        className='absolute inset-0 bg-[#071829]/70'
      />
      <div
        aria-hidden='true'
        className='absolute inset-0 bg-gradient-to-r from-[#071829]/95 via-[#071829]/70 to-[#071829]/40'
      />
      {/* pt offsets the fixed site header */}
      <div className='relative mx-auto w-full max-w-[1200px] px-4 pt-24 pb-14 sm:px-6 lg:px-8 lg:pt-28'>
        <div className='max-w-[720px]'>
          <p className='text-[11px] font-medium tracking-[0.18em] text-[#F3B39C] uppercase'>
            {t('hero.eyebrow')}
          </p>
          <h1
            id='home-title'
            className='mt-5 text-[clamp(2.75rem,6vw,4.5rem)] text-white'
          >
            {t.rich('hero.title', {
              em: chunks => <em className='text-[#F3B39C] italic'>{chunks}</em>,
            })}
          </h1>
          <p className='mt-6 max-w-[56ch] text-[17px] leading-relaxed text-white/80 sm:text-[19px]'>
            {t('hero.lead')}
          </p>
          <div className='mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4'>
            <Button
              asChild
              variant='brand'
              size='brand'
              className='w-full sm:w-auto'
            >
              <Link
                href='/quote'
                data-track='begin_checkout'
                data-track-category='cta'
                data-track-label='hero_quote_fob'
              >
                {t('hero.primaryCta')}
              </Link>
            </Button>
            <Link
              href='#productos-del-mar'
              data-track='view_item_list'
              data-track-category='cta'
              data-track-label='hero_seafood_lines'
              className='inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#F3B39C] sm:w-auto sm:justify-start'
            >
              {t('hero.secondaryCta')}
              <ArrowRight
                aria-hidden='true'
                size={16}
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </div>
      <p className='pointer-events-none absolute right-6 bottom-5 hidden text-[11px] tracking-[0.14em] text-white/60 uppercase lg:block'>
        {t('hero.caption')}
      </p>
    </section>
  );
}
