'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { ArrowLeft, ArrowRight, ChevronRight } from '@/components/ui/icons';

interface Slide {
  image: string;
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
}

interface HeroSliderProps {
  slides: Slide[];
  locale: string;
}

export default function HeroSlider({ slides, locale }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className='relative h-[80vh] min-h-[560px] w-full overflow-hidden'>
      {/* Background images with crossfade */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === current ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
          }`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            className='object-cover object-center'
            sizes='100vw'
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className='absolute inset-0 bg-linear-to-r from-[#0a2744]/80 via-[#0a2744]/50 to-[#0a3d5c]/30' />
      <div className='absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0a2744]/50' />

      {/* Content */}
      <div className='relative flex h-full items-center'>
        <div className='container mx-auto px-6 sm:px-10 lg:px-16'>
          <div className='max-w-3xl'>
            {/* Badge */}
            <div className='mb-5 transition-all duration-700'>
              <span className='inline-block rounded-full border border-white/30 bg-white/15 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm'>
                {slide.badge}
              </span>
            </div>

            {/* Headline */}
            <h1
              key={`title-${current}`}
              className='animate-in fade-in slide-in-from-bottom-4 mb-4 text-4xl leading-tight font-black text-white drop-shadow-lg duration-700 sm:text-5xl lg:text-6xl'
            >
              {slide.title} <span style={{ color: '#7dd3fc' }}>{slide.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p
              key={`sub-${current}`}
              className='animate-in fade-in slide-in-from-bottom-4 mb-8 text-lg text-white/85 drop-shadow delay-75 duration-700 sm:text-xl lg:text-2xl'
            >
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div
              key={`cta-${current}`}
              className='animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-3 delay-150 duration-700 sm:flex-row'
            >
              <Link
                href={`/${locale}${slide.ctaHref}`}
                className='inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-black/30 transition-all hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-xl'
                data-track='view_item_list'
                data-track-category='hero'
                data-track-label={`hero_primary_${slide.ctaHref.replace(/\//g, '_')}`}
              >
                {slide.cta}
                <ArrowRight
                  size={20}
                  strokeWidth={2.5}
                />
              </Link>
              <Link
                href={`/${locale}${slide.ctaSecondaryHref}`}
                className='inline-flex items-center gap-2 rounded-xl border-2 border-white/50 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/15'
                data-track='begin_checkout'
                data-track-category='hero'
                data-track-label='hero_secondary_quote'
              >
                {slide.ctaSecondary}
              </Link>
            </div>

            {/* Certification trust strip */}
            <div className='mt-6 flex items-center gap-2'>
              {['BAP', 'HACCP', 'BRC', 'GlobalGAP'].map(cert => (
                <span
                  key={cert}
                  className='rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm'
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dots navigation */}
      <div className='absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3'>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir a slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${
              i === current ? 'h-3 w-8 bg-white' : 'h-3 w-3 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label='Slide anterior'
        className='absolute top-1/2 left-4 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/50 lg:left-8'
      >
        <ArrowLeft
          size={20}
          strokeWidth={2.5}
        />
      </button>
      <button
        onClick={next}
        aria-label='Siguiente slide'
        className='absolute top-1/2 right-4 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/50 lg:right-8'
      >
        <ChevronRight
          size={20}
          strokeWidth={2.5}
        />
      </button>

      {/* Counter */}
      <div className='absolute right-6 bottom-8 text-xs font-medium text-white/60 lg:right-16'>
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
}
