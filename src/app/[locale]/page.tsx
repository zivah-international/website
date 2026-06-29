'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

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

// ─── Card styles per category slot ───────────────────────────────────────────
const CARD_STYLES = [
  {
    bg: 'from-[#0c3547]/8 to-[#0c3547]/4 border-[#0c3547]/20 hover:border-[#0c3547]/50',
    dot: 'bg-secondary',
    btn: 'bg-secondary hover:bg-secondary/90 text-white',
    accent: 'text-secondary',
  },
  {
    bg: 'from-accent/10 to-accent/4 border-accent/20 hover:border-accent/50',
    dot: 'bg-accent',
    btn: 'bg-accent hover:bg-accent/90 text-white',
    accent: 'text-accent',
  },
  {
    bg: 'from-primary/10 to-primary/4 border-primary/20 hover:border-primary/50',
    dot: 'bg-primary',
    btn: 'bg-primary hover:bg-primary/90 text-white',
    accent: 'text-primary',
  },
  {
    bg: 'from-secondary/8 to-accent/4 border-secondary/20 hover:border-accent/40',
    dot: 'bg-secondary',
    btn: 'bg-secondary hover:bg-secondary/90 text-white',
    accent: 'text-secondary',
  },
];

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const larvaeRef = useRef<HTMLDivElement>(null);

  // ─── Hero slides — seafood & larvae primary, tropicals secondary ─────────
  const SLIDES = [
    {
      image:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=85',
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
      image:
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1920&q=85',
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
      image:
        'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1920&q=85',
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
    <div className='min-h-screen'>
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSlider
        slides={SLIDES}
        locale={locale}
      />

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section className='bg-primary text-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 md:grid-cols-4'>
            {[
              {
                value: '5+',
                label: t('hero.stats.countriesServed'),
                icon: (
                  <svg
                    className='h-6 w-6 opacity-80'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
                    />
                  </svg>
                ),
              },
              {
                value: '24h',
                label: t('hero.stats.containersYear'),
                icon: (
                  <svg
                    className='h-6 w-6 opacity-80'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                ),
              },
              {
                value: '4+',
                label: t('hero.stats.yearsExperience'),
                icon: (
                  <svg
                    className='h-6 w-6 opacity-80'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0'
                    />
                  </svg>
                ),
              },
              {
                value: '100%',
                label: t('hero.stats.qualityGuaranteed'),
                icon: (
                  <svg
                    className='h-6 w-6 opacity-80'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'
                    />
                  </svg>
                ),
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`flex flex-col items-center gap-2 py-8 text-center ${i < 3 ? 'border-r border-white/15' : ''}`}
              >
                <div className='mb-1'>{stat.icon}</div>
                <div className='text-3xl font-black tracking-tight'>{stat.value}</div>
                <div className='text-xs font-medium tracking-wide text-white/75 uppercase'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIMARY SPECIALTY — Shrimp & Larvae split panel ──────────────── */}
      <section className='overflow-hidden bg-[#071b26] py-0'>
        {/* Shrimp panel */}
        <div className='grid lg:grid-cols-2'>
          {/* Image */}
          <div className='relative min-h-80 lg:min-h-[520px]'>
            <Image
              src='https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=85'
              alt='Camarón Vannamei Premium Ecuador'
              fill
              className='object-cover object-center'
              sizes='(max-width:1024px) 100vw, 50vw'
            />
            {/* Deep ocean overlay — subtle blue-to-dark */}
            <div className='absolute inset-0 bg-linear-to-r from-[#071b26]/80 via-[#071b26]/30 to-transparent lg:from-transparent lg:via-transparent lg:to-[#071b26]/75' />
            <div className='absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#071b26]/60 lg:hidden' />
            {/* BAP cert badge overlay */}
            <div className='absolute top-6 left-6 flex gap-2'>
              {['BAP', 'HACCP', 'GlobalGAP'].map(c => (
                <span
                  key={c}
                  className='rounded-full border border-white/30 bg-[#071b26]/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm'
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Copy */}
          <div className='flex flex-col justify-center px-8 py-14 lg:px-14 xl:px-20'>
            <span className='text-accent mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase'>
              <svg
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z'
                />
              </svg>
              {t('home.shrimp.eyebrow')}
            </span>
            <h2 className='mb-4 text-3xl leading-tight font-black text-white sm:text-4xl xl:text-5xl'>
              {t('home.shrimp.title')}{' '}
              <span className='from-accent bg-linear-to-r to-[#5de4a0] bg-clip-text text-transparent'>
                {t('home.shrimp.titleHighlight')}
              </span>
            </h2>
            <p className='mb-8 text-base leading-relaxed text-white/70 sm:text-lg'>
              {t('home.shrimp.description')}
            </p>
            <ul className='mb-8 space-y-3'>
              {[
                t('home.shrimp.features.0'),
                t('home.shrimp.features.1'),
                t('home.shrimp.features.2'),
                t('home.shrimp.features.3'),
              ].map((f, i) => (
                <li
                  key={i}
                  className='flex items-start gap-3 text-sm text-white/80'
                >
                  <svg
                    className='text-accent mt-0.5 h-4 w-4 shrink-0'
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
                  {f}
                </li>
              ))}
            </ul>
            <div className='flex flex-wrap gap-3'>
              <Link
                href={`/${locale}/products?category=marinos-y-pesca`}
                className='bg-accent hover:bg-accent/90 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5'
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
                className='inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10'
              >
                {t('home.shrimp.ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>

        {/* Thin divider */}
        <div className='h-px bg-white/5' />

        {/* Larvae Lab panel — reversed */}
        <div
          ref={larvaeRef}
          className='grid lg:grid-cols-2'
        >
          {/* Copy — left on desktop */}
          <div className='order-2 flex flex-col justify-center px-8 py-14 lg:order-1 lg:px-14 xl:px-20'>
            <span className='text-primary mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase'>
              <svg
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
                />
              </svg>
              {t('home.larvae.eyebrow')}
            </span>
            <h2 className='mb-4 text-3xl leading-tight font-black text-white sm:text-4xl xl:text-5xl'>
              {t('home.larvae.title')}{' '}
              <span className='from-primary bg-linear-to-r to-[#ffaa6b] bg-clip-text text-transparent'>
                {t('home.larvae.titleHighlight')}
              </span>
            </h2>
            <p className='mb-8 text-base leading-relaxed text-white/70 sm:text-lg'>
              {t('home.larvae.description')}
            </p>
            <ul className='mb-8 space-y-3'>
              {[
                t('home.larvae.features.0'),
                t('home.larvae.features.1'),
                t('home.larvae.features.2'),
                t('home.larvae.features.3'),
              ].map((f, i) => (
                <li
                  key={i}
                  className='flex items-start gap-3 text-sm text-white/80'
                >
                  <svg
                    className='text-primary mt-0.5 h-4 w-4 shrink-0'
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
                  {f}
                </li>
              ))}
            </ul>
            <div className='flex flex-wrap gap-3'>
              <Link
                href={`/${locale}/products?category=larvas`}
                className='bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5'
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
                className='inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10'
              >
                {t('home.larvae.ctaSecondary')}
              </Link>
            </div>
          </div>

          {/* Image — right on desktop */}
          <div className='relative order-1 min-h-80 lg:order-2 lg:min-h-[520px]'>
            <Image
              src='https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=900&q=85'
              alt='Laboratorio de Larvas de Camarón Ecuador'
              fill
              className='object-cover object-center'
              sizes='(max-width:1024px) 100vw, 50vw'
            />
            <div className='absolute inset-0 bg-linear-to-l from-[#071b26]/80 via-[#071b26]/30 to-transparent lg:from-transparent lg:via-transparent lg:to-[#071b26]/75' />
            <div className='absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#071b26]/60 lg:hidden' />
            {/* Biosecurity label */}
            <div className='absolute top-6 right-6'>
              <span className='rounded-full border border-white/30 bg-[#071b26]/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm'>
                🔬 Bioseguridad Nivel A
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Ecuador — ocean-toned full-bleed section ──────────────────── */}
      <section className='relative overflow-hidden bg-[#0a2535] py-20'>
        {/* Subtle wave pattern background */}
        <div
          className='absolute inset-0 opacity-[0.04]'
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 50%, #00d4aa 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #0066cc 0%, transparent 50%)',
          }}
        />
        <div className='relative container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <span className='text-accent mb-3 block text-xs font-bold tracking-widest uppercase'>
              {t('home.whyEcuador.eyebrow')}
            </span>
            <h2 className='mb-4 text-3xl font-black text-white sm:text-4xl'>
              {t('home.whyEcuador.title')}
            </h2>
            <p className='mx-auto max-w-2xl text-base text-white/60'>
              {t('home.whyEcuador.subtitle')}
            </p>
          </div>

          <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {[
              {
                icon: (
                  <svg
                    className='h-7 w-7'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64'
                    />
                  </svg>
                ),
                stat: '#1',
                label: t('home.whyEcuador.items.0.label'),
                desc: t('home.whyEcuador.items.0.desc'),
                color: 'text-accent',
                border: 'border-accent/20 hover:border-accent/50',
              },
              {
                icon: (
                  <svg
                    className='h-7 w-7'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605'
                    />
                  </svg>
                ),
                stat: '12°C',
                label: t('home.whyEcuador.items.1.label'),
                desc: t('home.whyEcuador.items.1.desc'),
                color: 'text-secondary',
                border: 'border-secondary/20 hover:border-secondary/50',
              },
              {
                icon: (
                  <svg
                    className='h-7 w-7'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'
                    />
                  </svg>
                ),
                stat: 'BAP',
                label: t('home.whyEcuador.items.2.label'),
                desc: t('home.whyEcuador.items.2.desc'),
                color: 'text-primary',
                border: 'border-primary/20 hover:border-primary/50',
              },
              {
                icon: (
                  <svg
                    className='h-7 w-7'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12'
                    />
                  </svg>
                ),
                stat: 'FOB',
                label: t('home.whyEcuador.items.3.label'),
                desc: t('home.whyEcuador.items.3.desc'),
                color: 'text-accent',
                border: 'border-accent/20 hover:border-accent/50',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-2xl border bg-white/[0.04] p-6 transition-all duration-300 hover:bg-white/[0.07] ${item.border}`}
              >
                <div className={`${item.color} mb-3`}>{item.icon}</div>
                <div className={`${item.color} mb-1 text-2xl font-black tracking-tight`}>
                  {item.stat}
                </div>
                <div className='mb-2 text-sm font-bold text-white'>{item.label}</div>
                <div className='text-xs leading-relaxed text-white/50'>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories (DB-driven) ────────────────────────────────────────── */}
      <section
        className='bg-background py-20'
        id='products'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <div className='bg-secondary/10 text-secondary mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold'>
              {t('products.badge')}
            </div>
            <h2 className='text-foreground mb-4 text-3xl font-bold sm:text-4xl'>
              {t('products.title')}
            </h2>
            <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
              {t('products.description')}
            </p>
          </div>

          {loading ? (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='bg-card animate-pulse rounded-2xl border p-8'
                >
                  <div className='bg-muted mb-4 h-12 w-12 rounded-xl' />
                  <div className='bg-muted mb-3 h-5 rounded' />
                  <div className='bg-muted h-4 rounded' />
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
                    className={`group bg-linear-to-br ${style.bg} flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <div className='mb-4 flex items-start justify-between'>
                      <span className='text-4xl'>{cat.icon || '📦'}</span>
                      <span className={`${style.dot} mt-2 h-2 w-2 rounded-full`} />
                    </div>
                    <h3 className='text-foreground mb-2 text-lg font-bold'>{cat.name}</h3>
                    <p className='text-muted-foreground mb-6 flex-1 text-sm leading-relaxed'>
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
                        className='border-border hover:border-accent/50 hover:text-accent rounded-lg border px-3 py-2 text-xs font-medium transition-colors'
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
              className='bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg'
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

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section
        className='bg-muted/30 py-20'
        id='process'
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <div className='bg-primary/10 text-primary mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold'>
              {t('process.badge')}
            </div>
            <h2 className='text-foreground mb-4 text-3xl font-bold sm:text-4xl'>
              {t('process.title')}
            </h2>
            <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
              {t('process.description')}
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {(['📋', '🔍', '📄', '🚢'] as const).map((icon, i) => (
              <div
                key={i}
                className='bg-card border-accent/25 hover:border-accent/55 relative rounded-2xl border-2 p-6 shadow-sm transition-all duration-300 hover:shadow-md'
              >
                <div className='text-accent mb-2 text-5xl font-black opacity-15'>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className='mb-3 text-3xl'>{icon}</div>
                <h3 className='text-foreground mb-1 text-base font-bold'>
                  {t(`process.steps.${i}.title`)}
                </h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {t(`process.steps.${i}.description`)}
                </p>
                {i < 3 && (
                  <div className='text-primary/30 absolute top-1/2 -right-4 hidden -translate-y-1/2 lg:block'>
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
              className='bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg'
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
      <section className='bg-muted/20 py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <div className='bg-accent/10 text-accent mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold'>
              {t('testimonials.badge')}
            </div>
            <h2 className='text-foreground mb-4 text-3xl font-bold sm:text-4xl'>
              {t('testimonials.title')}
            </h2>
          </div>
          <div className='grid gap-6 md:grid-cols-3'>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className='bg-card border-border/40 flex flex-col rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
              >
                <svg
                  className='text-primary/20 mb-4 h-8 w-8 shrink-0'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
                </svg>
                <p className='text-muted-foreground mb-6 flex-1 text-sm leading-relaxed'>
                  {t(`testimonials.items.${i}.quote`)}
                </p>
                <div className='border-border/40 flex items-center gap-3 border-t pt-4'>
                  <div className='bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg'>
                    {t(`testimonials.items.${i}.flag`)}
                  </div>
                  <div>
                    <div className='text-foreground text-sm font-semibold'>
                      {t(`testimonials.items.${i}.author`)}
                    </div>
                    <div className='text-muted-foreground text-xs'>
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
            <h3 className='mb-2 text-2xl font-bold text-white'>{t('newsletter.title')}</h3>
            <p className='mb-6 text-sm leading-relaxed text-white/80'>
              {t('newsletter.description')}
            </p>
            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                window.location.href = `mailto:sales@zivahinternational.com?subject=Newsletter%20B2B&body=Email%3A%20${encodeURIComponent(email)}`;
              }}
              className='flex gap-2'
            >
              <input
                type='email'
                name='email'
                required
                placeholder={t('newsletter.placeholder')}
                className='flex-1 rounded-lg border border-white/30 bg-white/15 px-4 py-2.5 text-sm text-white backdrop-blur-sm placeholder:text-white/60 focus:border-white/60 focus:ring-0 focus:outline-none'
              />
              <button
                type='submit'
                className='text-primary rounded-lg bg-white px-5 py-2.5 text-sm font-semibold transition-all hover:bg-white/90'
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
