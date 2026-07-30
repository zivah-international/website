'use client';

import { useLocale, useTranslations } from 'next-intl';

import HeroSlider from '@/components/HeroSlider';
import Navigation from '@/components/Navigation';
import CategoriesSection from '@/components/sections/CategoriesSection';
import FeatureSection from '@/components/sections/FeatureSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import ProcessSection from '@/components/sections/ProcessSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import WhyEcuadorSection from '@/components/sections/WhyEcuadorSection';
import { useScrollAnimation, getAnimationClasses } from '@/lib/hooks/use-scroll-animation';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();

  const SLIDES = [
    {
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

  return (
    <div className='min-h-screen bg-background'>
      <Navigation />
      <HeroSlider
        slides={SLIDES}
        locale={locale}
      />

      {/* Stats strip */}
      <section className='bg-primary text-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            ref={statsRef}
            className={`grid grid-cols-2 divide-x divide-white/20 md:grid-cols-4 ${getAnimationClasses('fade-up', statsVisible)}`}
          >
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

      {/* Shrimp feature */}
      <FeatureSection
        eyebrowColor='secondary'
        eyebrow={t('home.shrimp.eyebrow')}
        title={t('home.shrimp.title')}
        titleHighlight={t('home.shrimp.titleHighlight')}
        description={t('home.shrimp.description')}
        features={[0, 1, 2, 3].map(i => t(`home.shrimp.features.${i}`))}
        cta={{ label: t('home.shrimp.cta'), href: `/${locale}/products?category=marinos-y-pesca` }}
        ctaSecondary={{ label: t('home.shrimp.ctaSecondary'), href: `/${locale}/quote` }}
        image={{
          src: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=90',
          alt: 'Camarón Vannamei IQF Premium Ecuador',
        }}
        badge='BAP · HACCP · GlobalGAP · BRC'
        trackLabels={{ primary: 'home_shrimp_products', secondary: 'home_shrimp_quote' }}
      />

      {/* Larvae feature */}
      <FeatureSection
        eyebrowColor='primary'
        bgClassName='bg-primary/[0.03] py-14 lg:py-20'
        eyebrow={t('home.larvae.eyebrow')}
        title={t('home.larvae.title')}
        titleHighlight={t('home.larvae.titleHighlight')}
        description={t('home.larvae.description')}
        features={[0, 1, 2, 3].map(i => t(`home.larvae.features.${i}`))}
        cta={{ label: t('home.larvae.cta'), href: `/${locale}/products?category=larvas` }}
        ctaSecondary={{ label: t('home.larvae.ctaSecondary'), href: `/${locale}/quote` }}
        image={{
          src: 'https://images.unsplash.com/photo-1674962296996-b17a771d44b3?auto=format&fit=crop&w=900&q=90',
          alt: 'Laboratorio de Larvas de Camarón Ecuador',
        }}
        badge='🔬 SPF · Bioseguridad Nivel A'
        imagePosition='right'
        trackLabels={{ primary: 'home_larvae_products', secondary: 'home_larvae_quote' }}
      />

      {/* Why Ecuador */}
      <WhyEcuadorSection />
      <CategoriesSection />
      <ProcessSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
