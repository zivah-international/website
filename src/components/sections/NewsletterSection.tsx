'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { getAnimationClasses, useScrollAnimation } from '@/lib/hooks/use-scroll-animation';

export default function NewsletterSection() {
  const t = useTranslations();
  const { ref, isVisible } = useScrollAnimation();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <section className='bg-primary py-16 text-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div
          ref={ref}
          className={`mx-auto max-w-xl text-center ${getAnimationClasses('fade-up', isVisible)}`}
        >
          <div className='mb-3 inline-block rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm'>
            Newsletter B2B
          </div>
          <h3 className='mb-2 text-2xl font-bold'>{t('newsletter.title')}</h3>
          <p className='mb-6 text-sm leading-relaxed text-white/80'>
            {t('newsletter.description')}
          </p>
          <form
            ref={formRef}
            onSubmit={e => {
              e.preventDefault();
              const email = (
                (e.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement
              ).value;
              window.location.href = `mailto:sales@zivahinternational.com?subject=Newsletter%20B2B&body=Email%3A%20${encodeURIComponent(email)}`;
            }}
            className='flex gap-2'
          >
            <input
              type='email'
              name='email'
              required
              placeholder={t('newsletter.placeholder')}
              className='flex-1 rounded-lg border border-white/30 bg-white/15 px-4 py-2.5 text-sm text-white backdrop-blur-sm placeholder:text-white/60 focus:border-white/60 focus:outline-none'
            />
            <button
              type='submit'
              className='rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-white/90'
            >
              {t('newsletter.cta')}
            </button>
          </form>
          <p className='mt-3 text-xs text-white/60'>{t('newsletter.privacy')}</p>
        </div>
      </div>
    </section>
  );
}
