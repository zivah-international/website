'use client';

import { useTranslations } from 'next-intl';

import { getAnimationClasses, useScrollAnimation } from '@/lib/hooks/use-scroll-animation';

const ITEMS = [
  { stat: '#4', color: 'text-primary', bg: 'bg-primary/6', border: 'border-primary/12' },
  { stat: '28°C', color: 'text-secondary', bg: 'bg-secondary/6', border: 'border-secondary/12' },
  { stat: 'BAP', color: 'text-primary', bg: 'bg-primary/6', border: 'border-primary/12' },
  { stat: 'FOB', color: 'text-secondary', bg: 'bg-secondary/6', border: 'border-secondary/12' },
];

export default function WhyEcuadorSection() {
  const t = useTranslations();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className='bg-background py-14'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-10 text-center'>
          <span className='mb-2 block text-xs font-bold tracking-widest text-secondary uppercase'>
            {t('home.whyEcuador.eyebrow')}
          </span>
          <h2 className='mb-3 text-3xl font-black text-foreground sm:text-4xl'>
            {t('home.whyEcuador.title')}
          </h2>
          <p className='mx-auto max-w-2xl text-sm text-muted-foreground'>
            {t('home.whyEcuador.subtitle')}
          </p>
        </div>

        <div
          ref={ref}
          className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${getAnimationClasses('fade-up', isVisible)}`}
        >
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className={`rounded-lg border ${item.border} ${item.bg} p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5`}
            >
              <div className={`${item.color} mb-2 text-2xl font-black`}>{item.stat}</div>
              <div className='mb-1.5 text-sm font-bold text-foreground'>
                {t(`home.whyEcuador.items.${i}.label`)}
              </div>
              <div className='text-xs leading-relaxed text-muted-foreground'>
                {t(`home.whyEcuador.items.${i}.desc`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
