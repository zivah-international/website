'use client';

import { useTranslations } from 'next-intl';

import { TestimonialQuote } from '@/components/ui/icons';
import { getAnimationClasses, useScrollAnimation } from '@/lib/hooks/use-scroll-animation';

export default function TestimonialsSection() {
  const t = useTranslations();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className='bg-muted/20 py-14'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 text-center'>
          <div className='mb-3 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent'>
            {t('testimonials.badge')}
          </div>
          <h2 className='mb-4 text-3xl font-bold text-foreground sm:text-4xl'>
            {t('testimonials.title')}
          </h2>
        </div>

        <div
          ref={ref}
          className={`grid gap-6 md:grid-cols-3 ${getAnimationClasses('fade-up', isVisible)}`}
        >
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className='flex flex-col rounded-lg border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5'
            >
              <TestimonialQuote
                className='mb-4 h-7 w-7 shrink-0 text-primary/25'
                size={28}
              />
              <p className='mb-6 flex-1 text-sm leading-relaxed text-muted-foreground'>
                {t(`testimonials.items.${i}.quote`)}
              </p>
              <div className='flex items-center gap-3 border-t border-border/40 pt-4'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg'>
                  {t(`testimonials.items.${i}.flag`)}
                </div>
                <div>
                  <div className='text-sm font-semibold text-foreground'>
                    {t(`testimonials.items.${i}.author`)}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {t(`testimonials.items.${i}.role`)} · {t(`testimonials.items.${i}.country`)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
