'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import { ArrowRight, ChevronRight, Globe, Package, QuoteIcon, Search } from '@/components/ui/icons';
import { getAnimationClasses, useScrollAnimation } from '@/lib/hooks/use-scroll-animation';

const STEPS = [QuoteIcon, Search, Package, Globe] as const;

export default function ProcessSection() {
  const t = useTranslations();
  const locale = useLocale();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      className='bg-background py-14'
      id='process'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 text-center'>
          <div className='mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary'>
            {t('process.badge')}
          </div>
          <h2 className='mb-4 text-3xl font-bold text-foreground sm:text-4xl'>
            {t('process.title')}
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            {t('process.description')}
          </p>
        </div>

        <div
          ref={ref}
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${getAnimationClasses('fade-up', isVisible)}`}
        >
          {STEPS.map((Icon, i) => (
            <div
              key={i}
              className='relative rounded-lg border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-black/5'
            >
              <div className='mb-2 text-5xl font-black text-primary/12 select-none'>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <Icon
                  size={20}
                  strokeWidth={2.3}
                />
              </div>
              <h3 className='mb-1 text-base font-bold text-foreground'>
                {t(`process.steps.${i}.title`)}
              </h3>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                {t(`process.steps.${i}.description`)}
              </p>
              {i < 3 && (
                <div className='absolute top-1/2 -right-4 hidden -translate-y-1/2 text-primary/25 lg:block'>
                  <ChevronRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='mt-10 text-center'>
          <Link
            href={`/${locale}/quote`}
            className='inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg'
            data-track='begin_checkout'
            data-track-category='process'
            data-track-label='home_process_quote'
          >
            {t('hero.requestQuote')}
            <ArrowRight
              size={16}
              strokeWidth={2.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
