'use client';

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

// ─── Slides (swap Unsplash for real product photos when available) ───────────
const SLIDES = [
  {
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1920&q=80',
    badge: '🦐 Acuicultura Premium · Ecuador',
    title: 'Camarón Vannamei',
    titleHighlight: 'Certificado',
    subtitle: 'BAP · HACCP · GlobalGAP · Exportación directa desde Guayas',
    cta: 'Ver Camarón',
    ctaHref: '/products?category=camaron',
    ctaSecondary: 'Solicitar Cotización',
    ctaSecondaryHref: '/quote',
  },
  {
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1920&q=80',
    badge: '🍍 Frutas Tropicales · Origen Ecuador',
    title: 'Mango · Piña',
    titleHighlight: 'Premium',
    subtitle: 'Certificado GlobalGAP · Trazabilidad completa · 24h respuesta',
    cta: 'Ver Frutas',
    ctaHref: '/products?category=frutas-tropicales',
    ctaSecondary: 'Solicitar Cotización',
    ctaSecondaryHref: '/quote',
  },
  {
    image:
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1920&q=80',
    badge: '🚢 Logística Internacional · Miami & Guayaquil',
    title: 'Exportamos a',
    titleHighlight: '5+ Países',
    subtitle: 'Documentación lista · FOB Ecuador · Respuesta en 24h',
    cta: 'Ver Catálogo',
    ctaHref: '/products',
    ctaSecondary: 'Hablar con un asesor',
    ctaSecondaryHref: '/contact',
  },
];

// ─── Category card accent colors ─────────────────────────────────────────────
const CARD_STYLES = [
  {
    bg: 'from-primary/10 to-primary/5 border-primary/20 hover:border-primary/50',
    dot: 'bg-primary',
    btn: 'bg-primary hover:bg-primary/90',
  },
  {
    bg: 'from-accent/10 to-accent/5 border-accent/20 hover:border-accent/50',
    dot: 'bg-accent',
    btn: 'bg-accent hover:bg-accent/90',
  },
  {
    bg: 'from-secondary/10 to-secondary/5 border-secondary/20 hover:border-secondary/50',
    dot: 'bg-secondary',
    btn: 'bg-secondary hover:bg-secondary/90',
  },
  {
    bg: 'from-primary/10 to-accent/5 border-primary/20 hover:border-accent/50',
    dot: 'bg-primary',
    btn: 'bg-primary hover:bg-primary/90',
  },
];

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

      {/* ── Hero Slider ──────────────────────────────────────────────────── */}
      <HeroSlider
        slides={SLIDES}
        locale={locale}
      />

      {/* ── Stats trust strip ────────────────────────────────────────────── */}
      <section className='bg-card border-border/40 border-y'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='divide-border/30 grid grid-cols-2 divide-x md:grid-cols-4'>
            {[
              { value: '5+', label: t('hero.stats.countriesServed') },
              { value: '24h', label: t('hero.stats.containersYear') },
              { value: '4+', label: t('hero.stats.yearsExperience') },
              { value: '100%', label: t('hero.stats.qualityGuaranteed') },
            ].map((stat, i) => (
              <div
                key={i}
                className='py-6 text-center'
              >
                <div className='text-accent text-3xl font-black'>{stat.value}</div>
                <div className='text-muted-foreground mt-1 text-xs font-medium'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
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
                        className={`${style.btn} flex-1 rounded-lg py-2 text-center text-xs font-semibold text-white transition-colors`}
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
              className='bg-accent hover:bg-accent/90 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg'
            >
              Ver catálogo completo
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
            {(['📋', '🔍', '📄', '🚢'] as const).map((icon, i) => {
              const borderColors = [
                'border-primary/30 hover:border-primary/60',
                'border-secondary/30 hover:border-secondary/60',
                'border-accent/30 hover:border-accent/60',
                'border-primary/30 hover:border-primary/60',
              ];
              const numColors = ['text-primary', 'text-secondary', 'text-accent', 'text-primary'];
              return (
                <div
                  key={i}
                  className={`bg-card relative rounded-2xl border-2 p-6 shadow-sm transition-all duration-300 hover:shadow-md ${borderColors[i]}`}
                >
                  <div className={`mb-2 text-5xl font-black opacity-15 ${numColors[i]}`}>
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
                    <div className='text-muted-foreground/30 absolute top-1/2 -right-4 hidden -translate-y-1/2 text-xl lg:block'>
                      →
                    </div>
                  )}
                </div>
              );
            })}
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
      <section className='bg-background py-20'>
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
                className='bg-card border-border/50 hover:border-accent/30 flex flex-col rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:shadow-md'
              >
                <div className='text-accent mb-4 text-4xl leading-none'>&ldquo;</div>
                <p className='text-muted-foreground mb-6 flex-1 text-sm leading-relaxed italic'>
                  {t(`testimonials.items.${i}.quote`)}
                </p>
                <div className='border-border/40 flex items-center gap-3 border-t pt-5'>
                  <div className='bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg'>
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
      <section className='bg-muted/40 border-border/50 border-y py-14'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-xl text-center'>
            <div className='text-accent mb-3 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold tracking-widest uppercase shadow-sm dark:bg-white/10'>
              Newsletter B2B
            </div>
            <h3 className='text-foreground mb-2 text-2xl font-bold'>{t('newsletter.title')}</h3>
            <p className='text-muted-foreground mb-6 text-sm leading-relaxed'>
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
                className='border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-accent/50 flex-1 rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:outline-none'
              />
              <button
                type='submit'
                className='bg-accent hover:bg-accent/90 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors'
              >
                {t('newsletter.cta')}
              </button>
            </form>
            <p className='text-muted-foreground mt-3 text-xs'>{t('newsletter.privacy')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
