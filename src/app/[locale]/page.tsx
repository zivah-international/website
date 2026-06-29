'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import HeroSlider from '@/components/HeroSlider';
import Navigation from '@/components/Navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

const CARD_STYLES = [
  {
    dot: 'bg-secondary',
    btn: 'bg-secondary hover:bg-secondary/90 text-white',
    text: 'text-secondary',
  },
  { dot: 'bg-accent', btn: 'bg-accent hover:bg-accent/90 text-white', text: 'text-accent' },
  { dot: 'bg-primary', btn: 'bg-primary hover:bg-primary/90 text-white', text: 'text-primary' },
  {
    dot: 'bg-secondary',
    btn: 'bg-secondary hover:bg-secondary/90 text-white',
    text: 'text-secondary',
  },
];

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const SLIDES = [
    {
      // Premium IQF shrimp on ice — bright, well-lit, blue-toned
      image:
        'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1920&q=90',
      badge: t('hero.slides.shrimp.badge'),
      title: t('hero.slides.shrimp.title'),
      titleHighlight: t('hero.slides.shrimp.titleHighlight'),
      subtitle: t('hero.slides.shrimp.subtitle'),
      cta: t('hero.slides.shrimp.cta'),
      ctaHref: '/products?category=marinos-y-pesca',
      ctaSecondary: t('hero.slides.shrimp.ctaSecondary'),
      ctaSecondaryHref: '/quote',
    },
    {
      // Aquaculture / fish farm aerial or water lab — blue/teal
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=90',
      badge: t('hero.slides.larvae.badge'),
      title: t('hero.slides.larvae.title'),
      titleHighlight: t('hero.slides.larvae.titleHighlight'),
      subtitle: t('hero.slides.larvae.subtitle'),
      cta: t('hero.slides.larvae.cta'),
      ctaHref: '/products?category=larvas',
      ctaSecondary: t('hero.slides.larvae.ctaSecondary'),
      ctaSecondaryHref: '/quote',
    },
    {
      // Fishing / ocean harvest
      image:
        'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1920&q=90',
      badge: t('hero.slides.fruits.badge'),
      title: t('hero.slides.fruits.title'),
      titleHighlight: t('hero.slides.fruits.titleHighlight'),
      subtitle: t('hero.slides.fruits.subtitle'),
      cta: t('hero.slides.fruits.cta'),
      ctaHref: '/products?category=frutas-tropicales',
      ctaSecondary: t('hero.slides.fruits.ctaSecondary'),
      ctaSecondaryHref: '/quote',
    },
  ];

  useEffect(() => {
    fetch(`/api/categories?locale=${locale}`)
      .then(r => (r.ok ? r.json() : { data: [] }))
      .then(json => setCategories(json.data || json || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, [locale]);

  return (
    <div className='min-h-screen bg-background'>
      <Navigation />
      <HeroSlider
        slides={SLIDES}
        locale={locale}
      />

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section className='bg-primary text-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 divide-x divide-white/20 md:grid-cols-4'>
            {[
              { value: '5+', label: t('hero.stats.countriesServed') },
              { value: '24h', label: t('hero.stats.containersYear') },
              { value: '4+', label: t('hero.stats.yearsExperience') },
              { value: '100%', label: t('hero.stats.qualityGuaranteed') },
            ].map((s, i) => (
              <div
                key={i}
                className='flex flex-col items-center gap-1.5 py-6 text-center'
              >
                <div className='text-2xl font-black tracking-tight'>{s.value}</div>
                <div className='text-xs font-medium tracking-widest text-white/75 uppercase'>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shrimp feature ───────────────────────────────────────────────── */}
      <section className='bg-background py-14 lg:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
            {/* Image */}
            <div className='relative'>
              <div className='overflow-hidden rounded-2xl shadow-xl shadow-primary/10'>
                <Image
                  src='https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=90'
                  alt='Camarón Vannamei IQF Premium Ecuador'
                  width={900}
                  height={600}
                  className='h-72 w-full object-cover lg:h-[420px]'
                />
                <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-4 py-3'>
                  <div className='flex flex-wrap gap-1.5'>
                    {['BAP', 'HACCP', 'GlobalGAP', 'BRC'].map(c => (
                      <span
                        key={c}
                        className='rounded-full border border-white/40 bg-white/20 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm'
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div>
              <span className='mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-secondary uppercase'>
                <span className='h-px w-5 bg-current' />
                {t('home.shrimp.eyebrow')}
              </span>
              <h2 className='mb-4 text-3xl leading-tight font-black text-foreground sm:text-4xl'>
                {t('home.shrimp.title')}{' '}
                <span className='text-secondary'>{t('home.shrimp.titleHighlight')}</span>
              </h2>
              <p className='mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base'>
                {t('home.shrimp.description')}
              </p>
              <ul className='mb-7 space-y-2.5'>
                {[0, 1, 2, 3].map(i => (
                  <li
                    key={i}
                    className='flex items-start gap-2.5 text-sm'
                  >
                    <svg
                      className='mt-0.5 h-4 w-4 shrink-0 text-secondary'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M4.5 12.75l6 6 9-13.5'
                      />
                    </svg>
                    <span className='text-foreground/80'>{t(`home.shrimp.features.${i}`)}</span>
                  </li>
                ))}
              </ul>
              <div className='flex flex-wrap gap-3'>
                <Link
                  href={`/${locale}/products?category=marinos-y-pesca`}
                  className='inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-secondary/90'
                >
                  {t('home.shrimp.cta')}
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M17 8l4 4m0 0l-4 4m4-4H3'
                    />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/quote`}
                  className='inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:border-secondary hover:text-secondary'
                  data-track='begin_checkout'
                  data-track-category='feature'
                  data-track-label='home_shrimp_quote'
                >
                  {t('home.shrimp.ctaSecondary')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Larvae feature ───────────────────────────────────────────────── */}
      <section className='bg-primary/[0.03] py-14 lg:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
            {/* Copy — left */}
            <div className='order-2 lg:order-1'>
              <span className='mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase'>
                <span className='h-px w-5 bg-current' />
                {t('home.larvae.eyebrow')}
              </span>
              <h2 className='mb-4 text-3xl leading-tight font-black text-foreground sm:text-4xl'>
                {t('home.larvae.title')}{' '}
                <span className='text-primary'>{t('home.larvae.titleHighlight')}</span>
              </h2>
              <p className='mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base'>
                {t('home.larvae.description')}
              </p>
              <ul className='mb-7 space-y-2.5'>
                {[0, 1, 2, 3].map(i => (
                  <li
                    key={i}
                    className='flex items-start gap-2.5 text-sm'
                  >
                    <svg
                      className='mt-0.5 h-4 w-4 shrink-0 text-primary'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M4.5 12.75l6 6 9-13.5'
                      />
                    </svg>
                    <span className='text-foreground/80'>{t(`home.larvae.features.${i}`)}</span>
                  </li>
                ))}
              </ul>
              <div className='flex flex-wrap gap-3'>
                <Link
                  href={`/${locale}/products?category=larvas`}
                  className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90'
                >
                  {t('home.larvae.cta')}
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M17 8l4 4m0 0l-4 4m4-4H3'
                    />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/quote`}
                  className='inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:border-primary hover:text-primary'
                  data-track='begin_checkout'
                  data-track-category='feature'
                  data-track-label='home_larvae_quote'
                >
                  {t('home.larvae.ctaSecondary')}
                </Link>
              </div>
            </div>

            {/* Image — right */}
            <div className='relative order-1 lg:order-2'>
              <div className='overflow-hidden rounded-2xl shadow-xl shadow-primary/10'>
                <Image
                  src='https://images.unsplash.com/photo-1674962296996-b17a771d44b3?auto=format&fit=crop&w=900&q=90'
                  alt='Laboratorio de Larvas de Camarón Ecuador'
                  width={900}
                  height={600}
                  className='h-72 w-full object-cover lg:h-[420px]'
                />
                <div className='absolute top-3 right-3'>
                  <span className='rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-primary shadow-sm'>
                    🔬 SPF · Bioseguridad Nivel A
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Ecuador ──────────────────────────────────────────────────── */}
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

          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {[
              {
                stat: '#4',
                color: 'text-primary',
                bg: 'bg-primary/6',
                border: 'border-primary/12',
                label: t('home.whyEcuador.items.0.label'),
                desc: t('home.whyEcuador.items.0.desc'),
              },
              {
                stat: '28°C',
                color: 'text-secondary',
                bg: 'bg-secondary/6',
                border: 'border-secondary/12',
                label: t('home.whyEcuador.items.1.label'),
                desc: t('home.whyEcuador.items.1.desc'),
              },
              {
                stat: 'BAP',
                color: 'text-primary',
                bg: 'bg-primary/6',
                border: 'border-primary/12',
                label: t('home.whyEcuador.items.2.label'),
                desc: t('home.whyEcuador.items.2.desc'),
              },
              {
                stat: 'FOB',
                color: 'text-secondary',
                bg: 'bg-secondary/6',
                border: 'border-secondary/12',
                label: t('home.whyEcuador.items.3.label'),
                desc: t('home.whyEcuador.items.3.desc'),
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border ${item.border} ${item.bg} p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-black/5`}
              >
                <div className={`${item.color} mb-2 text-2xl font-black`}>{item.stat}</div>
                <div className='mb-1.5 text-sm font-bold text-foreground'>{item.label}</div>
                <div className='text-xs leading-relaxed text-muted-foreground'>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Larvae feature — soft warm tint background ───────────────────── */}
      <section className='bg-primary/[0.04] py-20 lg:py-28'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
            {/* Copy — left */}
            <div className='order-2 lg:order-1'>
              <span className='mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase'>
                <span className='h-px w-5 bg-current' />
                {t('home.larvae.eyebrow')}
              </span>
              <h2 className='mb-4 text-3xl leading-tight font-black text-foreground sm:text-4xl'>
                {t('home.larvae.title')}{' '}
                <span className='text-primary'>{t('home.larvae.titleHighlight')}</span>
              </h2>
              <p className='mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base'>
                {t('home.larvae.description')}
              </p>
              <ul className='mb-7 space-y-2.5'>
                {[0, 1, 2, 3].map(i => (
                  <li
                    key={i}
                    className='flex items-start gap-2.5 text-sm'
                  >
                    <svg
                      className='mt-0.5 h-4 w-4 shrink-0 text-primary'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M4.5 12.75l6 6 9-13.5'
                      />
                    </svg>
                    <span className='text-foreground/80'>{t(`home.larvae.features.${i}`)}</span>
                  </li>
                ))}
              </ul>
              <div className='flex flex-wrap gap-3'>
                <Link
                  href={`/${locale}/products?category=larvas`}
                  className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90'
                >
                  {t('home.larvae.cta')}
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M17 8l4 4m0 0l-4 4m4-4H3'
                    />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/quote`}
                  className='inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:border-primary hover:text-primary'
                  data-track='begin_checkout'
                  data-track-category='feature'
                  data-track-label='home_larvae2_quote'
                >
                  {t('home.larvae.ctaSecondary')}
                </Link>
              </div>
            </div>

            {/* Image — right */}
            <div className='relative order-1 lg:order-2'>
              <div className='overflow-hidden rounded-2xl shadow-xl shadow-primary/10'>
                <Image
                  src='https://images.unsplash.com/photo-1674962296996-b17a771d44b3?auto=format&fit=crop&w=900&q=90'
                  alt='Laboratorio de Larvas de Camarón Ecuador'
                  width={900}
                  height={600}
                  className='h-72 w-full object-cover lg:h-[420px]'
                />
                <div className='absolute top-3 right-3'>
                  <span className='rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-primary shadow-sm'>
                    🔬 SPF · Bioseguridad Nivel A
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Ecuador ──────────────────────────────────────────────────── */}
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

          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {[
              {
                stat: '#4',
                color: 'text-primary',
                bg: 'bg-primary/6',
                border: 'border-primary/12',
                label: t('home.whyEcuador.items.0.label'),
                desc: t('home.whyEcuador.items.0.desc'),
              },
              {
                stat: '28°C',
                color: 'text-secondary',
                bg: 'bg-secondary/6',
                border: 'border-secondary/12',
                label: t('home.whyEcuador.items.1.label'),
                desc: t('home.whyEcuador.items.1.desc'),
              },
              {
                stat: 'BAP',
                color: 'text-primary',
                bg: 'bg-primary/6',
                border: 'border-primary/12',
                label: t('home.whyEcuador.items.2.label'),
                desc: t('home.whyEcuador.items.2.desc'),
              },
              {
                stat: 'FOB',
                color: 'text-secondary',
                bg: 'bg-secondary/6',
                border: 'border-secondary/12',
                label: t('home.whyEcuador.items.3.label'),
                desc: t('home.whyEcuador.items.3.desc'),
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border ${item.border} ${item.bg} p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-black/5`}
              >
                <div className={`${item.color} mb-2 text-2xl font-black`}>{item.stat}</div>
                <div className='mb-1.5 text-sm font-bold text-foreground'>{item.label}</div>
                <div className='text-xs leading-relaxed text-muted-foreground'>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section
        className='bg-muted/30 py-14'
        id='products'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-8 text-center'>
            <div className='mb-3 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-semibold text-secondary'>
              {t('products.badge')}
            </div>
            <h2 className='mb-4 text-3xl font-bold text-foreground sm:text-4xl'>
              {t('products.title')}
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              {t('products.description')}
            </p>
          </div>

          {loading ? (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='animate-pulse rounded-2xl border bg-card p-8'
                >
                  <div className='mb-4 h-12 w-12 rounded-xl bg-muted' />
                  <div className='mb-3 h-5 rounded bg-muted' />
                  <div className='h-4 rounded bg-muted' />
                </div>
              ))}
            </div>
          ) : (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {categories.slice(0, 4).map((cat, i) => {
                const style = CARD_STYLES[i % CARD_STYLES.length];
                return (
                  <div
                    key={cat.id}
                    className='group flex flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5'
                  >
                    <div className='mb-4 flex items-start justify-between'>
                      <span className='text-4xl'>{cat.icon || '📦'}</span>
                      <span className={`${style.dot} mt-2 h-2 w-2 rounded-full`} />
                    </div>
                    <h3 className='mb-2 text-lg font-bold text-foreground'>{cat.name}</h3>
                    <p className='mb-6 flex-1 text-sm leading-relaxed text-muted-foreground'>
                      {cat.description}
                    </p>
                    <div className='flex gap-2'>
                      <Link
                        href={`/${locale}/products?category=${cat.slug}`}
                        className={`${style.btn} flex-1 rounded-lg py-2 text-center text-xs font-semibold transition-colors`}
                      >
                        {t('products.viewDetail')}
                      </Link>
                      <Link
                        href={`/${locale}/quote`}
                        className='rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:border-accent/50 hover:text-accent'
                        data-track='begin_checkout'
                        data-track-category='category_card'
                        data-track-label='home_category_quote'
                      >
                        {t('products.requestQuote').split(' ')[0]}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className='mt-10 text-center'>
            <Link
              href={`/${locale}/products`}
              className='inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg'
            >
              {t('home.viewFullCatalog')}
              <svg
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M17 8l4 4m0 0l-4 4m4-4H3'
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
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

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {(['📋', '🔍', '📄', '🚢'] as const).map((icon, i) => (
              <div
                key={i}
                className='relative rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-black/5'
              >
                <div className='mb-2 text-5xl font-black text-primary/12 select-none'>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className='mb-3 text-3xl'>{icon}</div>
                <h3 className='mb-1 text-base font-bold text-foreground'>
                  {t(`process.steps.${i}.title`)}
                </h3>
                <p className='text-sm leading-relaxed text-muted-foreground'>
                  {t(`process.steps.${i}.description`)}
                </p>
                {i < 3 && (
                  <div className='absolute top-1/2 -right-4 hidden -translate-y-1/2 text-primary/25 lg:block'>
                    <svg
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className='mt-10 text-center'>
            <Link
              href={`/${locale}/quote`}
              className='inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg'
              data-track='begin_checkout'
              data-track-category='process'
              data-track-label='home_process_quote'
            >
              {t('hero.requestQuote')}
              <svg
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M17 8l4 4m0 0l-4 4m4-4H3'
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
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
          <div className='grid gap-6 md:grid-cols-3'>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className='flex flex-col rounded-2xl border border-border/40 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5'
              >
                <svg
                  className='mb-4 h-8 w-8 shrink-0 text-primary/15'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
                </svg>
                <p className='mb-6 flex-1 text-sm leading-relaxed text-muted-foreground'>
                  {t(`testimonials.items.${i}.quote`)}
                </p>
                <div className='flex items-center gap-3 border-t border-border/40 pt-4'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg'>
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

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <section className='bg-primary py-16 text-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-xl text-center'>
            <div className='mb-3 inline-block rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm'>
              Newsletter B2B
            </div>
            <h3 className='mb-2 text-2xl font-bold'>{t('newsletter.title')}</h3>
            <p className='mb-6 text-sm leading-relaxed text-white/80'>
              {t('newsletter.description')}
            </p>
            <form
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
    </div>
  );
}
